import MiradorViewer from "@/components/DocumentComponents/MiradorViewer"
import { DocumentItemInfo, DocumentViewerContext, DocumentWorkspace, ManifestURLBase, getWorkspace, performWorkspaceAction } from "@/utils/functions/documentWorkspace"
import { useState } from "react"

interface DocumentViewerProviderProps {
    children: React.ReactNode
}

const docIndexInWorkspace = (doc: DocumentItemInfo) => {
    const items = getWorkspace()
    return items.findIndex(info => info.key === doc.key)
}

/**
 * The descendants of this provider can display a Document in Mirador by using
 * the DocumentViewerContext to set the active document:
 * 
 * const { setDoc } = useContext(DocumentViewerContext);
 * 
 * setDoc(myDoc) --> opens the document in the viewer
 */
export const DocumentViewerProvider = ({ children }: DocumentViewerProviderProps) => {
    const [doc, setDoc] = useState<DocumentItemInfo | null>(null)
    const [workspace, setWorkspace] = useState<DocumentWorkspace>(getWorkspace())
    const handleMiradorClose = () => {
        setDoc(null)
        return true
    }
    return (<DocumentViewerContext.Provider value={{ doc, setDoc, workspace }}>
        {children}
        {doc && <MiradorViewer
            manifestUrlBase={ManifestURLBase}
            domId='__mirador'
            onClose={handleMiradorClose}
            manifestId={doc.key}
            workspaceAction={docIndexInWorkspace(doc) >= 0 ? 'Remove' : 'Add'}
            onWorkspaceAction={(_, element) => {
                setWorkspace(performWorkspaceAction(doc, element))
            }} />}
    </DocumentViewerContext.Provider>)
}