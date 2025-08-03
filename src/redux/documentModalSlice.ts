// Create this file: @/redux/documentModalSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DocumentData {
  key: string;
  label: string;
  thumb?: string;
  zoteroGroupId: string;
  zoteroItemId: string;
  revision_number?: number;
  textSnippet?: string;
}

interface DocumentModalState {
  isOpen: boolean;
  currentDocument: DocumentData | null;
}

const initialState: DocumentModalState = {
  isOpen: false,
  currentDocument: null,
};

const documentModalSlice = createSlice({
  name: 'documentModal',
  initialState,
  reducers: {
    openDocumentModal: (state, action: PayloadAction<DocumentData>) => {
      state.isOpen = true;
      state.currentDocument = action.payload;
    },
    closeDocumentModal: (state) => {
      state.isOpen = false;
      state.currentDocument = null;
    },
    setDocumentData: (state, action: PayloadAction<DocumentData>) => {
      state.currentDocument = action.payload;
    },
  },
});

export const { openDocumentModal, closeDocumentModal, setDocumentData } =
  documentModalSlice.actions;

export default documentModalSlice.reducer;
