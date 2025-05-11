import React, { useContext, useEffect, useState } from 'react';
import {
  Tooltip, Badge, IconButton,
} from '@mui/material';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import { Bookmarks, GridView, ViewList } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import voyageLogo from '@/assets/sv-logo.png';
import {
  DocumentViewerContext,
  DocumentWorkspace,
} from '@/utils/functions/documentWorkspace';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import DocumentGallery from '@/components/PresentationComponents/Document/DocumentGallery';
import DocumentSearchBox, { DocumentPaginationSource } from '@/components/PresentationComponents/Document/DocumentSearchBox';

type DocumentGalleryViewMode = 'grid' | 'list';

const getWorkspaceSource = (items: DocumentWorkspace) => {
  const paginationSource: DocumentPaginationSource = {
    count: items.length,
    getPage: (pageNum, pageSize) =>
      Promise.resolve(
        items.slice(
          (pageNum - 1) * pageSize,
          Math.min(items.length, pageNum * pageSize)
        )
      ),
  };
  return paginationSource;
};

type DocumentPageTab = 'Search' | 'Workspace';

type DocumentSources = Partial<
  Record<DocumentPageTab, DocumentPaginationSource>
>;

const DocumentPage: React.FC = () => {
  // Our state is composed of sources for each DocumentPageTab, which allow
  // switching tabs without loss of state.
  const { workspace, doc, setDoc } = useContext(DocumentViewerContext);
  const [sources, setSources] = useState<DocumentSources>({
    Workspace: getWorkspaceSource(workspace ?? []),
  });
  const [tab, setTab] = useState<DocumentPageTab>('Search');
  const [viewMode, setViewMode] = useState<DocumentGalleryViewMode>('list');
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  useEffect(() => {
    setSources({ ...sources, Workspace: getWorkspaceSource(workspace ?? []) });
  }, [workspace]);
  const tabSource = sources[tab];

  // TODO: Change the header colors.
  return (
    <>
      <div className="nav-blog-header-logo nav-blog-header-sticky-logo ">
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <img src={voyageLogo} alt={'voyages logo'} className="logo-blog" />
        </Link>
        <div style={{ display: 'flex' }}>
          <div style={tab === 'Workspace' ? { opacity: 0.33 } : {}}>
            {inputSearchValue ? (
              <div>
                <GlobalSearchButton />
                <span style={{ position: 'relative', bottom: 12, display: 'none' }}>  <DocumentSearchBox
                  onClick={() => setTab('Search')}
                  onUpdate={(src) => setSources({ ...sources, Search: src })}
                /> </span>

              </div>) :
              <DocumentSearchBox
                onClick={() => setTab('Search')}
                onUpdate={(src) => setSources({ ...sources, Search: src })}
              />}
          </div>
          {sources.Workspace && (
            <Tooltip
              title={
                sources.Workspace.count
                  ? 'My Workspace Documents'
                  : 'No Documents added to My Workspace yet'
              }
            >
              <IconButton
                aria-label="my-workspace"
                onClick={() =>
                  tab !== 'Workspace' ? setTab('Workspace') : setTab('Search')
                }
              >
                <Badge
                  badgeContent={sources.Workspace.count + ''}
                  color="primary"
                >
                  <Bookmarks color="action" />
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={
              viewMode === 'list'
                ? 'Switch to grid view'
                : 'Switch to list view'
            }
          >
            <IconButton
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? <GridView /> : <ViewList />}
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div
        style={{
          marginTop: '20px',
          marginLeft: '5vw',
          marginRight: '5vw',
          width: '90vw',
          display: doc ? 'none' : 'block',
        }}
      >
        {tabSource && (
          <DocumentGallery
            title={tab}
            source={tabSource}
            pageSize={12}
            thumbSize={320}
            viewMode={viewMode}
            onDocumentOpen={setDoc}
            onPageChange={(pageNum) =>
              setSources({
                ...sources,
                [tab]: { ...tabSource, currentPage: pageNum },
              })
            }
          />
        )}
      </div>
    </>
  );
};

export default DocumentPage;
