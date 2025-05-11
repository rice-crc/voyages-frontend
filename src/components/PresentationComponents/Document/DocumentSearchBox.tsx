import { useEffect, useState } from 'react';
import {
    Chip,
    CircularProgress,
    Menu,
    MenuItem,
    Paper,
    Snackbar,
    TextField,
    Tooltip, IconButton,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import {
    DocumentItemInfo
} from '@/utils/functions/documentWorkspace';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import docSearch, { DocumentSearchApiResult } from './docSearch';

export interface DocumentPaginationSource {
    count: number;
    currentPage?: number;
    getPage: (pageNum: number, pageSize: number) => Promise<DocumentItemInfo[]>;
}

interface DocumentSearchBoxProps {
    onClick?: () => void;
    onUpdate: (source: DocumentPaginationSource) => void;
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

const UIDocumentSearchFieldHeader: Record<DocumentSearchFields, string> = {
    title: 'Title',
    voyageIds: 'Voyage IDs',
    enslaver: 'Enslavers',
    shipname: 'Ship name',
    bib: 'Bibliography',
    fullText: 'Full text',
};

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

export interface DocumentSearchModel {
    title?: string;
    fullText?: string;
    bib?: string;
    enslavers?: string[];
    voyageIds?: number[];
    page: number;
    page_size: number;
    global_search?: string
}

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
            page_size: pageSize,
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
export default DocumentSearchBox