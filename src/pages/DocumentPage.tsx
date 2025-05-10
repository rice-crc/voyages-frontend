import React, { useContext, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  List,
  ListItem,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography, Badge, Pagination, IconButton, ImageListItem, ImageList, ImageListItemBar
} from '@mui/material';
import GlobalSearchButton from '@/components/PresentationComponents/GlobalSearch/GlobalSearchButton';
import { AutoStories, Bookmarks, Search, GridView, ViewList } from '@mui/icons-material';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { Link } from 'react-router-dom';
import voyageLogo from '@/assets/sv-logo.png';
import { useDimensions } from '@/hooks/useDimensions';
import {
  DocumentItemInfo,
  DocumentViewerContext,
  DocumentWorkspace,
  createDocKey,
} from '@/utils/functions/documentWorkspace';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

function useDebounce<T>(value: T, wait: number = 500) {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, wait);
    return () => clearTimeout(timer);
  }, [value, wait]);
  return debounceValue;
}

// Note: while the Documents API is under development, the schemas and fetch
// code are placed here. They can be later wrapped by createApi.

const DocumentSearchFieldNames = [
  'title',
  'voyageIds',
  'shipname',
  'enslaver',
  'fullText',
  'bib',
] as const;

type DocumentSearchFields = (typeof DocumentSearchFieldNames)[number];

interface DocumentSearchModel {
  title?: string;
  fullText?: string;
  bib?: string;
  enslavers?: string[];
  voyageIds?: number[];
  page: number;
  page_size: number;
  global_search?: string
}

interface DocumentSearchApiResult {
  matches: number;
  results: DocumentItemInfo[];
  error?: string;
}

const mkDocumentSearchApiErrorResult = (
  msg: string
): DocumentSearchApiResult => ({ error: msg, matches: 0, results: [] });

type DocumentSearchApi = (
  search: DocumentSearchModel
) => Promise<DocumentSearchApiResult>;

const docSearch: DocumentSearchApi = async (search) => {
  try {
    const response = await fetch(`${BASEURL}/docs/DocumentSearch/`, {
      method: 'POST',
      body: JSON.stringify(search),
      headers: {
        Authorization: AUTHTOKEN,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!data.page_size) {
      // Must be an error result.
      return mkDocumentSearchApiErrorResult(JSON.stringify(data));
    }
    const result: DocumentSearchApiResult = {
      matches: data.count,
      results: data.results.map((r: any) => {
        const {
          thumbnail: thumb,
          bib,
          title: label,
          zotero_group_id,
          zotero_item_id,
        } = r;
        return {
          key: createDocKey(zotero_group_id, zotero_item_id),
          label,
          bib,
          revision_number: 1,
          thumb,
        };
      }),
    };
    return result;
  } catch (e) {
    return mkDocumentSearchApiErrorResult((e as Error)?.message);
  }
};

interface DocumentPaginationSource {
  count: number;
  currentPage?: number;
  getPage: (pageNum: number, pageSize: number) => Promise<DocumentItemInfo[]>;
}

interface DocumentSearchBoxProps {
  onClick?: () => void;
  onUpdate: (source: DocumentPaginationSource) => void;
}

const UIDocumentSearchFieldHeader: Record<DocumentSearchFields, string> = {
  title: 'Title',
  voyageIds: 'Voyage IDs',
  enslaver: 'Enslavers',
  shipname: 'Ship name',
  bib: 'Bibliography',
  fullText: 'Full text',
};

const DocumentSearchBox = ({ onClick, onUpdate }: DocumentSearchBoxProps) => {
  const [validation, setValidation] = useState<
    Partial<Record<DocumentSearchFields, string>>
  >({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSearching, setSearching] = useState(false);
  const [searchData, setSearchData] = useState<
    Partial<Record<DocumentSearchFields, string>>
  >({ title: '' });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | undefined>();
  const debouncedSearch = useDebounce(searchData, 500);
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const search = (pageNum: number, pageSize: number) => {
    const model: DocumentSearchModel = {
      page: pageNum,
      page_size: pageSize
    };
    if (inputSearchValue) {
      model.global_search = inputSearchValue;
    }
    const validated: Partial<Record<DocumentSearchFields, string>> = {};
    for (const field of DocumentSearchFieldNames) {
      const value = debouncedSearch[field];
      if (!value) {
        continue;
      }
      if (field === 'enslaver' || field === 'voyageIds') {
        Object.assign(model, { [field]: value.split(/[/;\|]/) });
      } else {
        Object.assign(model, { [field]: value });
      }
    }
    setValidation(validated);
    return docSearch(model);
  };
  useEffect(() => {
    const update = async () => {
      const { matches: count, error } = await search(1, 1);
      const cache: Record<string, DocumentSearchApiResult> = {};
      const paginationSource: DocumentPaginationSource = {
        count,
        getPage: async (pageNum, pageSize) => {
          setSearching(true);
          const cacheKey = `C${pageNum}_${pageSize}`;
          const { results } = (cache[cacheKey] ??= await search(
            pageNum,
            pageSize
          ));
          setSearching(false);
          return results;
        },
      };
      onUpdate(paginationSource);
      setSearching(false);
      setLastError(error);
    };
    setSearching(true);
    update();
  }, [debouncedSearch]);
  const handleValueChange = (
    field: DocumentSearchFields,
    val: string | null
  ) => {
    const { [field]: _, ...others } = searchData;
    const updated = val !== null ? { ...others, [field]: val } : others;
    setSearchData(updated);
  };
  const menuItems = DocumentSearchFieldNames.filter(
    (field) => searchData[field] === undefined
  ).map((field) => (
    <MenuItem
      key={`menuitem_${field}`}
      onClick={() => {
        setAnchorEl(null);
        setSearchData({ [field]: '', ...searchData });
      }}
    >
      {UIDocumentSearchFieldHeader[field]}
    </MenuItem>
  ));
  return (
    <Paper
      onClick={onClick}
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        minWidth: 400,
      }}
    >
      {DocumentSearchFieldNames.filter(
        (field) => searchData[field] !== undefined
      ).map((field) => (
        <Chip
          color={
            validation[field]
              ? 'error'
              : searchData[field]
                ? 'primary'
                : 'secondary'
          }
          onFocus={onClick}
          onClick={() => setEditingField(field)}
          key={field}
          label={
            <>
              {editingField === field ? (
                <TextField
                  variant="standard"
                  size="small"
                  type="text"
                  value={searchData[field] ?? ''}
                  placeholder={UIDocumentSearchFieldHeader[field]}
                  onChange={(e) => handleValueChange(field, e.target.value)}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setEditingField(null);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span>{UIDocumentSearchFieldHeader[field]}</span>
                  <span style={{ textOverflow: 'ellipsis', maxWidth: 256 }}>
                    {searchData[field] ? `: ${searchData[field]}` : ''}
                  </span>
                </>
              )}
            </>
          }
          onDelete={() => handleValueChange(field, null)}
          style={{ display: 'flex', margin: '4px' }}
        />
      ))}
      <div style={{ marginLeft: 'auto' }}>
        {isSearching ? (
          <CircularProgress />
        ) : (
          <Tooltip title="Select query fields">
            <IconButton
              onClick={(e) => menuItems && setAnchorEl(e.currentTarget)}
            >
              <Search />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems}
      </Menu>
      <Snackbar
        open={!!lastError}
        message={lastError}
        autoHideDuration={5000}
      />
    </Paper>
  );
};

type DocumentGalleryViewMode = 'grid' | 'list';

interface DocumentGalleryProps {
  title: string;
  pageSize: number;
  source: DocumentPaginationSource;
  thumbSize: number;
  viewMode?: DocumentGalleryViewMode;
  onDocumentOpen: (doc: DocumentItemInfo) => void;
  onPageChange: (page: number) => void;
}

const DocumentGallery = ({
  title,
  pageSize,
  source,
  thumbSize,
  viewMode,
  onDocumentOpen,
  onPageChange,
}: DocumentGalleryProps) => {
  const [contents, setContents] = useState<DocumentItemInfo[]>([]);
  const numPages = Math.ceil(source.count / pageSize);
  useEffect(() => {
    const refresh = async () => {
      setContents(
        await source.getPage(
          Math.min(numPages, source.currentPage ?? 1),
          pageSize
        )
      );
    };
    refresh();
  }, [source]);
  const paginator = (
    <Pagination
      style={{ paddingTop: '4px', paddingBottom: '4px' }}
      count={numPages}
      page={source.currentPage ?? 1}
      onChange={(_, p) => onPageChange(p)}
    />
  );
  const galleryDivRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(galleryDivRef);
  return (
    <div ref={galleryDivRef}>
      <h2>
        {title} <small>(Item count: {source.count})</small>
      </h2>
      {viewMode === 'list' && (
        <>
          <List
            sx={{
              width: '100%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 220px)',
            }}
          >
            {contents.map((item) => (
              <ListItem key={item.key}>
                <Card
                  sx={{
                    display: 'flex',
                    ...(viewMode === 'list' ? { width: '100%' } : {}),
                  }}
                >
                  {item.thumb && (
                    <CardMedia
                      component="img"
                      sx={{ width: thumbSize }}
                      image={item.thumb}
                      alt={item.label}
                    />
                  )}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      {
                        // If there is a formatted bibliography, use that, but ensure
                        // that the HTML is sanitized to avoid XSS attacks.
                      }
                      {item.bib && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(item.bib),
                          }}
                        />
                      )}
                      {!item.bib && (
                        <Typography component="div" variant="h5">
                          {item.label}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        color="primary"
                        variant="contained"
                        aria-label={`Open ${item.label}`}
                        onClick={() => onDocumentOpen(item)}
                        startIcon={<AutoStories />}
                      >
                        <Typography component="div">
                          &nbsp;View Document
                        </Typography>
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              </ListItem>
            ))}
          </List>
        </>
      )}
      {viewMode !== 'list' && (
        <>
          <ImageList
            sx={{
              width: '100%',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 220px)',
            }}
            cols={Math.floor((0.9 * width) / thumbSize)}
            rowHeight={thumbSize}
          >
            {contents.map((item) => (
              <ImageListItem
                key={item.key}
                style={{ width: thumbSize, height: thumbSize }}
              >
                {item.thumb && (
                  <img
                    width={thumbSize}
                    height={thumbSize}
                    style={{ maxWidth: thumbSize, maxHeight: thumbSize }}
                    src={item.thumb}
                    alt={item.label}
                    loading="lazy"
                  />
                )}
                <ImageListItemBar
                  title={item.label}
                  actionIcon={
                    <Button
                      variant="contained"
                      color="primary"
                      aria-label={`Open ${item.label}`}
                      onClick={() => onDocumentOpen(item)}
                    >
                      <AutoStories />
                    </Button>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </>
      )}
      {paginator}
    </div>
  );
};

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
  console.log({ tabSource })
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
                <span style={{ position: 'relative', bottom: 12 }}>  <DocumentSearchBox
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
