import { useState, useRef } from 'react';

import { Button } from 'antd';
import { useSelector } from 'react-redux';

import MiradorViewer from '@/components/DocumentComponents/MiradorViewer';
import { RootState } from '@/redux/store';
import {
  DocumentItemInfo,
  DocumentViewerContext,
  DocumentWorkspace,
  ManifestURLBase,
  getWorkspace,
  performWorkspaceAction,
} from '@/utils/functions/documentWorkspace';
import '@/style/mirador.scss';

interface DocumentViewerProviderProps {
  children: React.ReactNode;
}

const docIndexInWorkspace = (doc: DocumentItemInfo) => {
  const items = getWorkspace();
  return items.findIndex((info) => info.key === doc.key);
};

/**
 * The descendants of this provider can display a Document in Mirador by using
 * the DocumentViewerContext to set the active document:
 *
 * const { setDoc } = useContext(DocumentViewerContext);
 *
 * setDoc(myDoc) --> opens the document in the viewer
 */
export const DocumentViewerProvider = ({
  children,
}: DocumentViewerProviderProps) => {
  const [doc, setDoc] = useState<DocumentItemInfo | null>(null);
  const [workspace, setWorkspace] = useState<DocumentWorkspace>(getWorkspace());
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMiradorClose = (
    event?: React.MouseEvent | React.KeyboardEvent,
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setDoc(null);
    // Additional cleanup
    setTimeout(() => {
      if (containerRef.current) {
        const computedStyle = window.getComputedStyle(containerRef.current);
        containerRef.current.style.visibility = computedStyle.visibility;
      }
    }, 100);

    return true;
  };

  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  const addLabels: Record<string, string> = {
    en: 'Add to Workspace',
    pt: 'Adicionar a área de trabalho',
    es: 'Agregar al área de trabajo',
  };

  const removeLabels: Record<string, string> = {
    en: 'Remove',
    pt: 'Remover',
    es: 'Eliminar',
  };
  // We hide the children when a document is open so that Mirador can be the
  // only thing visible in the UI.
  return (
    <DocumentViewerContext.Provider value={{ doc, setDoc, workspace }}>
      <div
        ref={containerRef}
        style={{
          visibility: doc ? 'hidden' : 'visible',
          position: doc ? 'absolute' : 'relative',
          height: doc ? 0 : 'auto',
        }}
      >
        {children}
      </div>

      <div style={{ display: 'none' }}>
        <Button id="__miradorWorkspaceAddBtn" className="view-document-btn">
          {addLabels[languageValue ?? 'en']}
        </Button>
        <Button
          danger
          id="__miradorWorkspaceRemoveBtn"
          className="remove-document-btn"
        >
          {removeLabels[languageValue ?? 'en']}
        </Button>
      </div>
      {doc && (
        <MiradorViewer
          manifestUrlBase={ManifestURLBase}
          domId="__mirador"
          onClose={handleMiradorClose}
          manifestId={doc.key}
          workspaceAction={docIndexInWorkspace(doc) >= 0 ? 'Remove' : 'Add'}
          onWorkspaceAction={(_, element) => {
            setWorkspace(performWorkspaceAction(doc, element));
          }}
        />
      )}
    </DocumentViewerContext.Provider>
  );
};
