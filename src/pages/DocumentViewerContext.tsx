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
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useSelector } from 'react-redux';
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
  const handleMiradorClose = () => {
    setDoc(null);
    return true;
  };
  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
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
      <div style={{ display: doc ? 'none' : 'block' }}>{children}</div>
      <div style={{ display: 'none' }}>
        <Button color="primary" id="__miradorWorkspaceAddBtn">
          {addLabels[languageValue ?? 'en']}
        </Button>
        <Button color="error" id="__miradorWorkspaceRemoveBtn">
          {removeLabels[languageValue ?? 'en']}
        </Button>
      </div>
      {/* {doc && (
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
      )} */}
    </DocumentViewerContext.Provider>
  );
};
