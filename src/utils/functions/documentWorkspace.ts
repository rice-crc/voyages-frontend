import React from 'react';

export interface DocumentItemInfo {
  key: string;
  label: string;
  bib?: string;
  revision_number: number;
  thumb: string | null;
  textSnippet:string
}

const UserWorkspaceLocalStorageKey = 'my-workspace';

export const ManifestURLBase =
  'https://voyages-api-staging.crc.rice.edu/static/iiif_manifests/';

export type DocumentWorkspace = DocumentItemInfo[];

export const createDocKey = (zotero_group_id: string, zotero_item_id: string) =>
  `${zotero_group_id}__${zotero_item_id}.json`;

export const getWorkspace = () => {
  const stored = localStorage.getItem(UserWorkspaceLocalStorageKey);
  const items: DocumentWorkspace = JSON.parse(stored ?? '[]');
  return items;
};

export const performWorkspaceAction = (
  doc: DocumentItemInfo,
  element: HTMLElement
) => {
  const items = getWorkspace();
  const matchIndex = items.findIndex((info) => info.key === doc.key);
  if (matchIndex >= 0) {
    // Already in the workspace, so we remove it.
    if (!confirm('Remove document from workspace?')) {
      return items;
    }
    items.splice(matchIndex, 1);
  } else {
    items.push(doc);
  }
  localStorage.setItem(UserWorkspaceLocalStorageKey, JSON.stringify(items));
  element.style.display = 'none';
  return items;
};

interface DocumentViewerContextValue {
  doc: DocumentItemInfo | null;
  setDoc: (d: DocumentItemInfo | null) => void;
  workspace?: DocumentWorkspace;
}

export const DocumentViewerContext =
  React.createContext<DocumentViewerContextValue>({
    doc: null,
    setDoc: () => {},
  });
