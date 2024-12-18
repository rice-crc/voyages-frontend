import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import mirador from 'mirador';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type WorkspaceAction = 'Add' | 'Remove' | 'None';

interface MiradorViewerProps {
  workspaceAction: WorkspaceAction;
  manifestUrlBase: string;
  domId: string;
  manifestId: string;
  onWorkspaceAction: (manifestId: string, element: HTMLElement) => void;
  onClose?: () => boolean;
}

const findWin = (store: any, manifestId: string): any =>
  Object.values(store.getState().windows).find(
    (w: any) => w.manifestId === manifestId
  );

const updateMiradorUI = (
  workspaceAction: string,
  enableClose: boolean,
  manifestId: string,
  onWorkspaceAction: any
) => {
  const topBar = document.getElementsByClassName('mirador-window-top-bar');
  if (!topBar || !topBar[0]) {
    return false;
  }
  const getButton = (className: string) => {
    const matches = document.getElementsByClassName(className);
    if (matches.length === 1) {
      return matches[0];
    }
    return null;
  };
  const removeButton = (className: string) => getButton(className)?.remove();
  // Remove buttons from the UI.
  document.getElementById('addBtn')?.remove();
  removeButton('mirador-window-maximize');
  if (!enableClose) {
    removeButton('mirador-window-close');
  }
  removeButton('workspaceBtn');
  if (workspaceAction !== 'None') {
    const template = document.getElementById(
      `__miradorWorkspace${workspaceAction}Btn`
    );
    const workspaceBtn = template?.cloneNode(true) as HTMLButtonElement;
    if (workspaceBtn) {
      workspaceBtn.classList.add('workspaceBtn');
      workspaceBtn.onclick = () => onWorkspaceAction(manifestId, workspaceBtn);
      topBar[0].appendChild(workspaceBtn);
    }
  }
  return true;
};

const MiradorUserSettingsKey = '__miradorSettings';

const MiradorViewer = ({
  manifestUrlBase,
  manifestId,
  domId,
  workspaceAction,
  onWorkspaceAction,
  onClose,
}: MiradorViewerProps) => {
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState(null);
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const container = useRef<HTMLDivElement>(null!);
  const activeDoc = useRef<string | null>(null);
  const prevTheme = useRef<string | null>(null);
  // NOTE: Spanish is still not supported by Mirador! And for Portuguese, only
  // the Brazilian variant is available.
  const miradorLanguage = languageValue === 'pt' ? 'pt-BR' : 'en';
  useEffect(() => {
    if (!container.current) {
      return;
    }
    container.current.innerHTML = '';
    const div = document.createElement('div');
    div.id = domId;
    container.current.appendChild(div);
    const userSettings = JSON.parse(
      localStorage.getItem(MiradorUserSettingsKey) ?? '{}'
    );
    setTarget(
      mirador.viewer({
        ...userSettings,
        id: domId,
        language: miradorLanguage,
      })
    );
    return () => {
      div.remove();
    };
  }, [domId]);
  useEffect(() => {
    if (!target) {
      return;
    }
    const store = mirador.selectors.miradorSlice(target).store;
    const path = `${manifestUrlBase.replace(/\/$/, '')}/${manifestId}`;
    const match = Object.values(store.getState().manifests).find(
      (w: any) => w.id === path
    );
    if (!match) {
      // Add the manifest.
      const addRes = mirador.actions.addResource(path);
      store.dispatch(addRes);
    }
    // - Close any other window in the viewer.
    for (const winKey of Object.keys(store.getState().windows)) {
      const rmw = mirador.actions.removeWindow(winKey);
      store.dispatch(rmw);
    }
    // - Create a window with the manifest...
    let canvasLoaded = false;
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const { selectedTheme } = state.config;
      if (prevTheme.current && prevTheme.current !== selectedTheme) {
        localStorage.setItem(
          MiradorUserSettingsKey,
          JSON.stringify({
            selectedTheme: selectedTheme,
          })
        );
      }
      prevTheme.current = selectedTheme;
      if (
        activeDoc.current === manifestId &&
        canvasLoaded &&
        onClose &&
        Object.keys(state.windows).length === 0
      ) {
        onClose();
        activeDoc.current = null;
        return;
      }
      if (canvasLoaded || (state.manifests[path]?.isFetching ?? true)) {
        return;
      }
      canvasLoaded = true;
      try {
        const win = findWin(store, path);
        const displayAction = mirador.actions.setCanvas(
          win.id,
          `${path}/canvas1`
        );
        store.dispatch(displayAction);
      } catch (e) {
        console.log(e);
      }
      setReady(true);
      activeDoc.current = manifestId;
    });
    store.dispatch(mirador.actions.fetchManifest(path));
    store.dispatch(mirador.actions.addWindow({ manifestId: path }));
    // - Maximize the window.
    for (const winKey of Object.keys(store.getState().windows)) {
      const maxw = mirador.actions.maximizeWindow(winKey);
      store.dispatch(maxw);
    }
    const uiUpdater = setInterval(() => {
      if (
        updateMiradorUI(workspaceAction, !!close, manifestId, onWorkspaceAction)
      ) {
        clearInterval(uiUpdater);
      }
    }, 100);
    return () => {
      unsubscribe();
      clearInterval(uiUpdater);
    };
  }, [target, manifestUrlBase, manifestId, ready]);
  // We use the ready flag to hide the Mirador UI while the manifest window is
  // loaded. This prevents the user from seeing the Mirador app without any
  // windows for a brief moment.
  return <div ref={container} style={{ opacity: ready ? 1 : 0 }}></div>;
};

export default MiradorViewer;
