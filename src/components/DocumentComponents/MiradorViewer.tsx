import { useEffect, useState } from 'react'
import mirador from "mirador"

type WorkspaceAction = 'Add' | 'Remove' | 'None'

interface MiradorViewerProps {
    workspaceAction: WorkspaceAction,
    manifestUrlBase: string,
    domId: string,
    manifestId: string,
    onWorkspaceAction: (manifestId: string) => void,
    onClose?: () => boolean
}

const findWin = (store: any, manifestId: string): any =>
    Object.values(store.getState().windows)
        .find((w: any) => w.manifestId === manifestId)

const MiradorViewer = ({ manifestUrlBase, manifestId, domId, workspaceAction, onWorkspaceAction, onClose }: MiradorViewerProps) => {
    const [ready, setReady] = useState(false)
    const [target, setTarget] = useState(null)
    useEffect(() => {
        setTarget(mirador.viewer({ id: domId }))
    }, [domId])
    useEffect(() => {
        if (!target) {
            return
        }
        const store = mirador.selectors.miradorSlice(target).store
        const path = `${manifestUrlBase}/${manifestId}`
        const match = Object.values(store.getState().manifests).find(w => w.id === path)
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
        store.subscribe(() => {
            if (canvasLoaded && onClose && Object.keys(store.getState().windows).length === 0) {
                onClose()
            }
            if (canvasLoaded || (store.getState().manifests[path]?.isFetching ?? true)) {
                return
            }
            canvasLoaded = true
            try {
                const win = findWin(store, path)
                const displayAction = mirador.actions.setCanvas(
                    win.id,
                    `https://voyages-docs.org/${manifestId}/canvas1`
                )
                store.dispatch(displayAction)
                const getButton = (className: string) => {
                    const matches = document.getElementsByClassName(className)
                    if (matches.length === 1) {
                        return matches[0]
                    }
                    return null
                }
                const removeButton = (className: string) => getButton(className)?.remove()
                // Remove buttons from the UI.
                removeButton('mirador-window-maximize')
                if (!onClose) {
                    removeButton('mirador-window-close')
                }
                removeButton('workspaceBtn')
                if (workspaceAction !== 'None') {
                    const workspaceBtn = document.createElement('button')
                    workspaceBtn.style.minWidth = "260px"
                    workspaceBtn.className = `workspaceBtn MuiButtonBase-root MuiFab-root mirador9 MuiFab-sizeMedium MuiFab-extended MuiFab-${workspaceAction === 'Add' ? 'primary' : 'danger'} mirador10`
                    const icon = workspaceAction === 'Add'
                        ? `<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                            </svg>`
                        : ''
                    workspaceBtn.innerHTML = `<span class="MuiFab-label">
                            ${icon}
                            ${workspaceAction === 'Add' ? 'Add to my Workspace' : 'Remove from Workspace'}
                        </span>`
                    workspaceBtn.onclick = () => onWorkspaceAction(manifestId)
                    document.getElementsByClassName('mirador-window-top-bar')[0].appendChild(workspaceBtn)
                }
            } catch (e) {
                console.log(e)
            }
            setReady(true)
        })
        store.dispatch(mirador.actions.fetchManifest(path))
        store.dispatch(mirador.actions.addWindow({ manifestId: path }))
        // - Maximize the window.
        for (const winKey of Object.keys(store.getState().windows)) {
            const maxw = mirador.actions.maximizeWindow(winKey)
            store.dispatch(maxw)
        }
    }, [target, manifestUrlBase, manifestId])
    // We use the ready flag to hide the Mirador UI while the manifest window is
    // loaded. This prevents the user from seeing the Mirador app without any
    // windows for a brief moment.
    return <div id={domId} style={{ opacity: ready ? 1 : 0 }}></div>
}

export default MiradorViewer