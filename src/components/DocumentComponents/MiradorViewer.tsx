import { useEffect, useRef, useState } from 'react'
// @ts-ignore
import mirador from "mirador"

type WorkspaceAction = 'Add' | 'Remove' | 'None'

interface MiradorViewerProps {
    workspaceAction: WorkspaceAction,
    manifestUrlBase: string,
    domId: string,
    manifestId: string,
    onWorkspaceAction: (manifestId: string, element: HTMLElement) => void,
    onClose?: () => boolean
}

const findWin = (store: any, manifestId: string): any =>
    Object.values(store.getState().windows)
        .find((w: any) => w.manifestId === manifestId)

const updateMiradorUI = (
    workspaceAction: string,
    enableClose: boolean,
    manifestId: string,
    onWorkspaceAction: any) => {
    const topBar = document.getElementsByClassName('mirador-window-top-bar')
    if (!topBar || !topBar[0]) {
        return false
    }
    const getButton = (className: string) => {
        const matches = document.getElementsByClassName(className)
        if (matches.length === 1) {
            return matches[0]
        }
        return null
    }
    const removeButton = (className: string) => getButton(className)?.remove()
    // Remove buttons from the UI.
    document.getElementById('addBtn')?.remove()
    removeButton('mirador-window-maximize')
    if (!enableClose) {
        removeButton('mirador-window-close')
    }
    removeButton('workspaceBtn')
    if (workspaceAction !== 'None') {
        const workspaceBtn = document.createElement('button')
        workspaceBtn.type = 'button'
        workspaceBtn.style.minWidth = "260px"
        workspaceBtn.style.maxHeight = "36px"
        workspaceBtn.className = `workspaceBtn MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-colorPrimary css-j8xhxh-MuiButtonBase-root-MuiButton-root`
        workspaceBtn.innerHTML = `<span class="MuiFab-label" style="width: 100%">
                ${workspaceAction === 'Add' ? 'Add to Workspace' : 'Remove'}
            </span>`
        workspaceBtn.onclick = () => onWorkspaceAction(manifestId, workspaceBtn)
        topBar[0].appendChild(workspaceBtn)
    }
    return true
}

const MiradorViewer = ({ manifestUrlBase, manifestId, domId, workspaceAction, onWorkspaceAction, onClose }: MiradorViewerProps) => {
    const [ready, setReady] = useState(false)
    const [target, setTarget] = useState(null)
    const container = useRef<HTMLDivElement>(null!)
    const activeDoc = useRef<string | null>(null)
    useEffect(() => {
        if (!container.current) {
            return
        }
        container.current.innerHTML = ''
        const div = document.createElement('div')
        div.id = domId
        container.current.appendChild(div)
        setTarget(mirador.viewer({ id: domId }))
        return () => {

        }
    }, [domId])
    useEffect(() => {
        if (!target) {
            return
        }
        const store = mirador.selectors.miradorSlice(target).store
        const path = `${manifestUrlBase.replace(/\/$/, '')}/${manifestId}`
        const match = Object.values(store.getState().manifests).find((w: any) => w.id === path)
        if (!match) {
            // Add the manifest.
            const addRes = mirador.actions.addResource(path)
            store.dispatch(addRes)
        }
        // - Close any other window in the viewer.
        for (const winKey of Object.keys(store.getState().windows)) {
            const rmw = mirador.actions.removeWindow(winKey)
            store.dispatch(rmw)
        }
        // - Create a window with the manifest...
        let canvasLoaded = false
        const unsubscribe = store.subscribe(() => {
            if (activeDoc.current === manifestId && canvasLoaded && onClose && Object.keys(store.getState().windows).length === 0) {
                onClose()
                activeDoc.current = null
                return
            }
            if (canvasLoaded || (store.getState().manifests[path]?.isFetching ?? true)) {
                return
            }
            canvasLoaded = true
            try {
                const win = findWin(store, path)
                const displayAction = mirador.actions.setCanvas(
                    win.id,
                    `${path}/canvas1`
                )
                store.dispatch(displayAction)
            } catch (e) {
                console.log(e)
            }
            setReady(true)
            activeDoc.current = manifestId
        })
        store.dispatch(mirador.actions.fetchManifest(path))
        store.dispatch(mirador.actions.addWindow({ manifestId: path }))
        // - Maximize the window.
        for (const winKey of Object.keys(store.getState().windows)) {
            const maxw = mirador.actions.maximizeWindow(winKey)
            store.dispatch(maxw)
        }
        const uiUpdater = setInterval(() => {
            if (updateMiradorUI(workspaceAction, !!close, manifestId, onWorkspaceAction)) {
                clearInterval(uiUpdater)
            }
        }, 100)
        return () => {
            unsubscribe()
            clearInterval(uiUpdater)
        }
    }, [target, manifestUrlBase, manifestId, ready])
    // We use the ready flag to hide the Mirador UI while the manifest window is
    // loaded. This prevents the user from seeing the Mirador app without any
    // windows for a brief moment.
    return <div ref={container} style={{ opacity: ready ? 1 : 0 }}></div>
}

export default MiradorViewer