import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, CircularProgress, List, ListItem, Menu, MenuItem, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import Badge from '@mui/material/Badge';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import MiradorViewer from '@/components/DocumentComponents/MiradorViewer';
// Icons
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Filter } from '@/share/InterfaceTypes';
import { AUTHTOKEN, BASEURL } from '@/share/AUTH_BASEURL';
import { Link } from 'react-router-dom';
import voyageLogo from '@/assets/sv-logo.png';
import { useDimensions } from '@/hooks/useDimensions';

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

const DocumentSearchFieldNames = ['label', 'voyages', 'shipname', 'enslaver'] as const

type DocumentSearchFields = typeof DocumentSearchFieldNames[number]

interface DocumentEntitySearchModel {
  typename: DocumentSearchFields,
  keys: string[]
}

interface DocumentSearchModel {
  label: string,
  entities: DocumentEntitySearchModel[],
  results_page: number,
  page_size: number
}

interface DocumentItemInfo {
  key: string,
  label: string,
  bib?: string,
  revision_number: number,
  thumb: string | null
}

interface DocumentSearchApiResult {
  matches: number,
  results: DocumentItemInfo[]
}

type DocumentSearchApi = (search: DocumentSearchModel) => Promise<DocumentSearchApiResult>

const docSearch: DocumentSearchApi = async (search) => {
  // Map our search model to the backend API.
  const filter: Filter[] = []
  filter.push({
    "varName": "has_published_manifest",
    "op": "exact",
    "searchTerm": true
  })
  if (search.label) {
    filter.push({
      "varName": "title",
      "op": "icontains",
      "searchTerm": search.label
    })
  }
  const fieldMap: Partial<Record<DocumentSearchFields, Omit<Filter, 'searchTerm'>>> = {
    'voyages': {
      varName: 'source_voyage_connections__voyage__id',
      op: 'in'
    },
    'enslaver': {
      varName: 'source_enslaver_connections__enslaver__principal_alias',
      op: 'icontains'
    },
    'shipname': {
      varName: 'source_voyage_connections__voyage__voyage_ship__ship_name',
      op: 'in'
    },
    //'Enslaved': 'source_enslaver_connections__'
  }
  for (const entity of search.entities) {
    const entityFilter = fieldMap[entity.typename]
    if (entityFilter) {
      filter.push({ ...entityFilter, searchTerm: entity.keys })
    }
  }
  const { page_size, results_page: page } = search
  const response = await fetch(`${BASEURL}/docs/`, {
    method: 'POST',
    body: JSON.stringify({ filter, page, page_size }),
    headers: {
      'Authorization': AUTHTOKEN,
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  const result: DocumentSearchApiResult = {
    matches: data.count,
    results: data.results.map((r: any) => {
      const { thumbnail: thumb, bib, title: label, zotero_group_id, zotero_item_id } = r
      return {
        key: `${zotero_group_id}__${zotero_item_id}.json`,
        label,
        bib,
        revision_number: 1,
        thumb
      }
    })
  }
  return result
}

interface DocumentPaginationSource {
  count: number,
  currentPage?: number,
  getPage: (pageNum: number, pageSize: number) => Promise<DocumentItemInfo[]>
}

interface DocumentSearchBoxProps {
  onClick?: () => void,
  onUpdate: (source: DocumentPaginationSource) => void
}

const UIDocumentSearchFieldHeader: Record<DocumentSearchFields, string> = {
  label: 'Title',
  voyages: 'Voyage IDs',
  enslaver: 'Enslavers',
  shipname: 'Ship name'
}

const DocumentSearchBox = ({ onClick, onUpdate }: DocumentSearchBoxProps) => {
  const [validation, setValidation] = useState<Partial<Record<DocumentSearchFields, string>>>({})
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [isSearching, setSearching] = useState(false)
  const [searchData, setSearchData] = useState<Partial<Record<DocumentSearchFields, string>>>({ label: '' })
  const [editingField, setEditingField] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchData, 500)
  const search = (pageNum: number, pageSize: number) => {
    const entities: DocumentEntitySearchModel[] = []
    const validated: Partial<Record<DocumentSearchFields, string>> = {}
    if (debouncedSearch.voyages) {
      try {
        const idArray = JSON.parse(`[${debouncedSearch.voyages}]`)
        entities.push({ typename: 'voyages', keys: idArray })
      } catch {
        const msg = 'Voyage IDs could not be properly parsed'
        validated['voyages'] = msg
      }
    }
    for (const field of DocumentSearchFieldNames) {
      const value = debouncedSearch[field]
      if (field !== 'voyages' && value) {
        entities.push({ typename: field, keys: [value] })
      }
    }
    const model: DocumentSearchModel = {
      label: debouncedSearch.label ?? '',
      results_page: pageNum,
      page_size: pageSize,
      entities
    }
    setValidation(validated)
    return docSearch(model)
  }
  useEffect(() => {
    const update = async () => {
      const { matches: count } = await search(1, 1)
      const cache: Record<string, DocumentSearchApiResult> = {}
      const paginationSource: DocumentPaginationSource = {
        count,
        getPage: async (pageNum, pageSize) => {
          setSearching(true)
          const cacheKey = `C${pageNum}_${pageSize}`
          const { results } = (cache[cacheKey] ??= await search(pageNum, pageSize))
          setSearching(false)
          return results
        }
      }
      onUpdate(paginationSource)
      setSearching(false)
    }
    setSearching(true)
    update()
  }, [debouncedSearch])
  const handleValueChange = (field: DocumentSearchFields, val: string | null) => {
    const { [field]: _, ...others } = searchData
    const updated = val !== null ? { ...others, [field]: val } : others
    setSearchData(updated)
  }
  const menuItems = DocumentSearchFieldNames
    .filter(field => searchData[field] === undefined)
    .map(field => <MenuItem
      key={`menuitem_${field}`}
      disabled={field === 'enslaver'}
      onClick={() => {
        setAnchorEl(null)
        setSearchData({ [field]: '', ...searchData })
      }}>
      {UIDocumentSearchFieldHeader[field]}
    </MenuItem>)
  return <Paper
    onClick={onClick}
    component="form"
    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', minWidth: 400 }}>
    {DocumentSearchFieldNames
      .filter(field => searchData[field] !== undefined)
      .map(field => (
        <Chip
          color={validation[field] ? "error" : (searchData[field] ? "primary" : "secondary")}
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
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      setEditingField(null)
                    }
                  }}
                  autoFocus
                />
              ) : <>
                <span>{UIDocumentSearchFieldHeader[field]}</span>
                <span style={{ textOverflow: "ellipsis", maxWidth: 256 }}>
                  {searchData[field] ? `: ${searchData[field]}` : ''}
                </span>
              </>
              }
            </>
          }
          onDelete={() => handleValueChange(field, null)}
          style={{ display: "flex", margin: "4px" }}
        />
      ))}
    <div style={{ marginLeft: "auto" }}>
      {isSearching
        ? <CircularProgress />
        : <Tooltip title="Select query fields">
          <IconButton onClick={(e) => menuItems && setAnchorEl(e.currentTarget)}>
            <SearchIcon />
          </IconButton>
        </Tooltip>}
    </div>
    <Menu anchorEl={anchorEl} open={anchorEl !== null} onClose={() => setAnchorEl(null)}>
      {menuItems}
    </Menu>
  </Paper>
}

type DocumentGalleryViewMode = 'grid' | 'list'

interface DocumentGalleryProps {
  title: string,
  pageSize: number,
  source: DocumentPaginationSource,
  thumbSize: number,
  viewMode?: DocumentGalleryViewMode,
  onDocumentOpen: (doc: DocumentItemInfo) => void
  onPageChange: (page: number) => void,
}

const DocumentGallery = ({ title, pageSize, source, thumbSize, viewMode, onDocumentOpen, onPageChange }: DocumentGalleryProps) => {
  const [contents, setContents] = useState<DocumentItemInfo[]>([])
  const numPages = Math.ceil(source.count / pageSize)
  useEffect(() => {
    const refresh = async () => {
      setContents(await source.getPage(Math.min(numPages, source.currentPage ?? 1), pageSize))
    }
    refresh()
  }, [source])
  const paginator = <Pagination style={{ paddingTop: '4px', paddingBottom: '4px' }} count={numPages} page={source.currentPage ?? 1} onChange={(_, p) => onPageChange(p)} />
  const galleryDivRef = useRef<HTMLDivElement>(null)
  const { width } = useDimensions(galleryDivRef)
  return <div ref={galleryDivRef}>
    <h2>{title} <small>(Item count: {source.count})</small></h2>
    {viewMode === 'list' && <>
      <List sx={{ width: '100%', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
        {contents.map((item) => (
          <ListItem key={item.key}>
            <Card sx={{ display: 'flex', ...(viewMode === 'list' ? { width: '100%' } : {}) }}>
              {item.thumb && <CardMedia
                component="img"
                sx={{ width: thumbSize }}
                image={item.thumb}
                alt={item.label}
              />}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  {
                    // If there is a formatted bibliography, use that, but ensure
                    // that the HTML is sanitized to avoid XSS attacks.
                  }
                  {item.bib && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.bib) }} />}
                  {!item.bib && <Typography component="div" variant="h5">
                    {item.label}
                  </Typography>}
                </CardContent>
                <CardActions><Button
                  color="primary"
                  variant="contained"
                  aria-label={`Open ${item.label}`}
                  onClick={() => onDocumentOpen(item)}
                  startIcon={<AutoStoriesIcon />}
                >
                  <Typography component="div">&nbsp;View Document</Typography>
                </Button>
                </CardActions>
              </Box>
            </Card>
          </ListItem>
        ))}
      </List>
    </>}
    {viewMode !== 'list' && <>
      <ImageList sx={{ width: '100%', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }} cols={Math.floor(0.9 * width / thumbSize)} rowHeight={thumbSize}>
        {contents.map((item) => (
          <ImageListItem key={item.key} style={{ width: thumbSize, height: thumbSize }}>
            {item.thumb && <img
              width={thumbSize}
              height={thumbSize}
              style={{ maxWidth: thumbSize, maxHeight: thumbSize }}
              src={item.thumb}
              alt={item.label}
              loading="lazy"
            />}
            <ImageListItemBar
              title={item.label}
              actionIcon={
                <Button
                  variant="contained"
                  color="primary"
                  aria-label={`Open ${item.label}`}
                  onClick={() => onDocumentOpen(item)}
                >
                  <AutoStoriesIcon />
                </Button>}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>}
    {paginator}
  </div>
}

const UserWorkspaceLocalStorageKey = 'my-workspace'

const getWorkspace = () => {
  const stored = localStorage.getItem(UserWorkspaceLocalStorageKey)
  const items: DocumentItemInfo[] = JSON.parse(stored ?? '[]')
  return items
}

const getWorkspaceSource = () => {
  const items = getWorkspace()
  const paginationSource: DocumentPaginationSource = {
    count: items.length,
    getPage: (pageNum, pageSize) =>
      Promise.resolve(
        items.slice(
          (pageNum - 1) * pageSize,
          Math.min(items.length, pageNum * pageSize)))
  }
  return paginationSource
}

type DocumentPageTab = 'Search' | 'Workspace'

type DocumentSources = Partial<Record<DocumentPageTab, DocumentPaginationSource>>

const docIndexInWorkspace = (doc: DocumentItemInfo, items?: DocumentItemInfo[]) => {
  items ??= getWorkspace()
  return items.findIndex(info => info.key === doc.key)
}

const DocumentPage: React.FC = () => {
  // Our state is composed of sources for each DocumentPageTab, which allow
  // switching tabs without loss of state.
  const [sources, setSources] = useState<DocumentSources>({
    Workspace: getWorkspaceSource()
  })
  const [doc, setDoc] = useState<DocumentItemInfo | null>(null)
  const [tab, setTab] = useState<DocumentPageTab>('Search')
  const [viewMode, setViewMode] = useState<DocumentGalleryViewMode>('list')
  const refreshWorkspace = () => {
    setSources({ ...sources, Workspace: getWorkspaceSource() })
  }
  const handleMiradorClose = () => {
    setDoc(null)
    return true
  }
  const handleWorkspaceAction = (manifestId: string, element: HTMLElement) => {
    if (!doc || doc.key !== manifestId) {
      console.log('Unexpected item added to collection')
      return
    }
    const items = getWorkspace()
    const matchIndex = docIndexInWorkspace(doc, items)
    if (matchIndex >= 0) {
      // Already in the workspace, so we remove it.
      if (!confirm('Remove document from workspace?')) {
        return
      }
      items.splice(matchIndex, 1)
    } else {
      items.push(doc)
    }
    localStorage.setItem(UserWorkspaceLocalStorageKey, JSON.stringify(items))
    element.style.display = 'none'
    refreshWorkspace()
  }
  const tabSource = sources[tab]
  // TODO: Change the header colors.
  return <>

    <div className="nav-blog-header-logo nav-blog-header-sticky-logo ">
      <Link
        to={'/'}
        style={{ textDecoration: 'none' }}
      >
        <img
          src={voyageLogo}
          alt={'voyages logo'}
          className='logo-blog'
        />
      </Link>
      <div style={{ display: 'flex' }}>
        <div style={tab === 'Workspace' ? { opacity: 0.33 } : {}}>
          <DocumentSearchBox onClick={() => setTab('Search')} onUpdate={src => setSources({ ...sources, Search: src })} />
        </div>
        {sources.Workspace &&
          <Tooltip title={sources.Workspace.count ? "My Workspace Documents" : "No Documents added to My Workspace yet"}>
            <IconButton aria-label="my-workspace" onClick={() => tab !== 'Workspace' ? setTab('Workspace') : setTab('Search')}>
              <Badge badgeContent={sources.Workspace.count + ''} color="primary">
                <BookmarksIcon color="action" />
              </Badge>
            </IconButton>
          </Tooltip>}
        <Tooltip title={viewMode === 'list' ? 'Switch to grid view' : 'Switch to list view'}>
          <IconButton onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
            {viewMode === 'list' ? <GridViewIcon /> : <ViewListIcon />}
          </IconButton>
        </Tooltip>
      </div>
    </div>
    <div style={{ marginTop: '20px', marginLeft: '5vw', marginRight: '5vw', width: '90vw', display: doc ? 'none' : 'block' }}>
      {tabSource && <DocumentGallery
        title={tab}
        source={tabSource}
        pageSize={12}
        thumbSize={320}
        viewMode={viewMode}
        onDocumentOpen={setDoc}
        onPageChange={pageNum => setSources({ ...sources, [tab]: { ...tabSource, currentPage: pageNum } })} />}
    </div>
    {doc && <MiradorViewer
      manifestUrlBase='https://voyages-api-staging.crc.rice.edu/static/iiif_manifests/'
      domId='__mirador'
      onClose={handleMiradorClose}
      manifestId={doc.key}
      workspaceAction={docIndexInWorkspace(doc) >= 0 ? 'Remove' : 'Add'}
      onWorkspaceAction={handleWorkspaceAction} />}
  </>
};

export default DocumentPage;
