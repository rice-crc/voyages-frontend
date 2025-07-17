import React, { useContext, useEffect, useState, useMemo } from 'react';

import { Bookmarks, GridView, ViewList } from '@mui/icons-material';
import { Tooltip, Badge, IconButton, Box } from '@mui/material';
import { useSelector } from 'react-redux';

import voyageLogo from '@/assets/sv-logo.png';
import DocumentGallery from '@/components/PresentationComponents/Document/DocumentGallery';
import DocumentSearchBox, {
  DocumentPaginationSource,
} from '@/components/PresentationComponents/Document/DocumentSearchBox';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import { RootState } from '@/redux/store';
import {
  DocumentViewerContext,
  DocumentWorkspace,
} from '@/utils/functions/documentWorkspace';

type DocumentGalleryViewMode = 'grid' | 'list';

const getWorkspaceSource = (items: DocumentWorkspace) => {
  const paginationSource: DocumentPaginationSource = {
    count: items.length,
    getPage: (pageNum, pageSize) =>
      Promise.resolve(
        items.slice(
          (pageNum - 1) * pageSize,
          Math.min(items.length, pageNum * pageSize),
        ),
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
    (state: RootState) => state.getCommonGlobalSearch,
  );

  useEffect(() => {
    setSources({ ...sources, Workspace: getWorkspaceSource(workspace ?? []) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  const tabSource = sources[tab];
  // TODO: Change the header colors.

  const documentGallery = useMemo(() => {
    if (!tabSource) return null;

    return (
      <DocumentGallery
        key={`${tab}-${viewMode}`}
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
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, tabSource, viewMode, sources]);

  return (
    <>
      <div className="nav-blog-header-logo nav-blog-header-sticky-logo">
        <a href={'/'} style={{ textDecoration: 'none' }}>
          <img src={voyageLogo} alt={'voyages logo'} className="logo-blog" />
        </a>
        <Box sx={{ display: 'flex' }}>
          <Box sx={tab === 'Workspace' ? { opacity: 0.33 } : {}}>
            {inputSearchValue ? (
              <Box>
                <GlobalSearchButton />
                <span
                  style={{ position: 'relative', bottom: 12, display: 'none' }}
                >
                  <DocumentSearchBox
                    onClick={() => setTab('Search')}
                    onUpdate={(src) => setSources({ ...sources, Search: src })}
                  />
                </span>
              </Box>
            ) : (
              <DocumentSearchBox
                onClick={() => setTab('Search')}
                onUpdate={(src) => setSources({ ...sources, Search: src })}
              />
            )}
          </Box>
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
        </Box>
      </div>

      {/* Updated to keep DocumentGallery mounted */}
      <Box
        sx={{
          marginTop: '20px',
          marginLeft: '5vw',
          marginRight: '5vw',
          width: '90vw',
          visibility: doc ? 'hidden' : 'visible',
          position: doc ? 'absolute' : 'relative',
          height: doc ? 0 : 'auto',
        }}
      >
        {documentGallery}
      </Box>
    </>
  );
};

export default DocumentPage;
