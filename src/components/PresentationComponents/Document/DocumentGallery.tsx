import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItem,
  Typography, Pagination, ImageListItem, ImageList, ImageListItemBar
} from '@mui/material';
import { AutoStories} from '@mui/icons-material';
import { useDimensions } from '@/hooks/useDimensions';
import {
  DocumentItemInfo,
} from '@/utils/functions/documentWorkspace';

interface DocumentPaginationSource {
  count: number;
  currentPage?: number;
  getPage: (pageNum: number, pageSize: number) => Promise<DocumentItemInfo[]>;
}

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
                      {item.textSnippet && (
                        <div
                          style={{
                            padding: 12,
                            fontSize: 13,
                            color: '#555',
                            lineHeight: 1.5,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(item.textSnippet),
                          }}
                        />
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

export default DocumentGallery;