import { useEffect, useRef, useState } from 'react';

import { AutoStories } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  List,
  ListItem,
  Typography,
  Pagination,
  ImageListItem,
  ImageList,
  ImageListItemBar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DOMPurify from 'dompurify';

import { useDimensions } from '@/hooks/useDimensions';
import { DocumentItemInfo } from '@/utils/functions/documentWorkspace';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const numPages = Math.ceil(source.count / pageSize);

  useEffect(() => {
    const refresh = async () => {
      setContents(
        await source.getPage(
          Math.min(numPages, source.currentPage ?? 1),
          pageSize,
        ),
      );
    };
    refresh();
  }, [source]);

  const galleryDivRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(galleryDivRef);

  // Calculate responsive grid columns
  const getGridCols = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return Math.max(1, Math.floor((0.9 * width) / thumbSize));
  };

  // Calculate responsive thumb size
  const getResponsiveThumbSize = () => {
    if (isMobile) return Math.min(thumbSize, width * 0.8);
    if (isTablet) return Math.min(thumbSize, width * 0.4);
    return thumbSize;
  };

  const responsiveThumbSize = getResponsiveThumbSize();
  const gridCols = getGridCols();

  const paginator = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Pagination
        count={numPages}
        page={source.currentPage ?? 1}
        onChange={(_, p) => onPageChange(p)}
        size={isMobile ? 'small' : 'medium'}
        siblingCount={isMobile ? 0 : 1}
        boundaryCount={isMobile ? 1 : 2}
      />
    </Box>
  );

  return (
    <Box
      ref={galleryDivRef}
      sx={{
        width: '100%',
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
      }}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h4'}
        component="h2"
        sx={{
          mb: 2,
          fontSize: { xs: '1.1rem', sm: '1.5rem', md: '2rem' },
          fontWeight: 'bold',
        }}
      >
        {title}
        <Typography
          component="span"
          variant="body2"
          sx={{
            ml: 1,
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            color: 'text.secondary',
          }}
        >
          (Item count: {source.count})
        </Typography>
      </Typography>

      {viewMode === 'list' && (
        <List
          sx={{
            width: '100%',
            overflowY: 'auto',
            maxHeight: {
              xs: 'calc(100vh - 180px)',
              sm: 'calc(100vh - 220px)',
            },
            p: 0,
          }}
        >
          {contents.map((item) => (
            <ListItem
              key={item.key}
              sx={{
                px: { xs: 0, sm: 2 },
                py: { xs: 2, sm: 2 },
              }}
            >
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  width: '100%',
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                {item.thumb && (
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: '100%', sm: responsiveThumbSize },
                      height: { xs: 200, sm: responsiveThumbSize },
                      objectFit: 'cover',
                    }}
                    image={item.thumb}
                    alt={item.label}
                  />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <CardContent
                    sx={{
                      flex: '1 0 auto',
                      px: { xs: 2, sm: 3 },
                      py: { xs: 2, sm: 3 },
                    }}
                  >
                    {item.bib && (
                      <Box
                        sx={{
                          '& *': {
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            lineHeight: 1.4,
                          },
                        }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.bib),
                        }}
                      />
                    )}
                    {!item.bib && (
                      <Typography
                        component="div"
                        variant={isMobile ? 'h6' : 'h5'}
                        sx={{
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          fontWeight: 'medium',
                          mb: 1,
                        }}
                      >
                        {item.label}
                      </Typography>
                    )}
                    {item.textSnippet && (
                      <Box
                        sx={{
                          p: { xs: 2, sm: 2 },
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          color: 'text.secondary',
                          lineHeight: 1.5,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                          mt: 1,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(item.textSnippet),
                        }}
                      />
                    )}
                  </CardContent>
                  <CardActions
                    sx={{
                      px: { xs: 2, sm: 3 },
                      pb: { xs: 2, sm: 3 },
                      pt: 0,
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      aria-label={`Open ${item.label}`}
                      onClick={() => onDocumentOpen(item)}
                      startIcon={<AutoStories />}
                      size={isMobile ? 'small' : 'medium'}
                      sx={{
                        backgroundColor: 'rgb(55, 148, 141)',
                        color: '#fff',
                        borderRadius: 1,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 2 },
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        '&:hover': {
                          backgroundColor: 'rgb(45, 128, 121)',
                        },
                      }}
                    >
                      View Document
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </ListItem>
          ))}
        </List>
      )}

      {viewMode !== 'list' && (
        <ImageList
          sx={{
            width: '100%',
            overflowY: 'auto',
            maxHeight: {
              xs: 'calc(100vh - 180px)',
              sm: 'calc(100vh - 220px)',
            },
            gap: { xs: 1, sm: 2 }, // Responsive gap between items
          }}
          cols={gridCols}
          rowHeight={responsiveThumbSize}
        >
          {contents.map((item) => (
            <ImageListItem
              key={item.key}
              sx={{
                width: responsiveThumbSize,
                height: responsiveThumbSize,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 1,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'scale(1.02)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              {item.thumb && (
                <img
                  width={responsiveThumbSize}
                  height={responsiveThumbSize}
                  style={{
                    maxWidth: responsiveThumbSize,
                    maxHeight: responsiveThumbSize,
                    objectFit: 'cover',
                  }}
                  src={item.thumb}
                  alt={item.label}
                  loading="lazy"
                />
              )}
              <ImageListItemBar
                title={
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      fontWeight: 'medium',
                    }}
                  >
                    {item.label}
                  </Typography>
                }
                actionIcon={
                  <Button
                    variant="contained"
                    color="primary"
                    aria-label={`Open ${item.label}`}
                    onClick={() => onDocumentOpen(item)}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      minWidth: 'auto',
                      p: { xs: 2, sm: 2 },
                      mr: 1,
                      backgroundColor: 'rgb(55, 148, 141)',
                      '&:hover': {
                        backgroundColor: 'rgb(45, 128, 121)',
                      },
                    }}
                  >
                    <AutoStories fontSize={isMobile ? 'small' : 'medium'} />
                  </Button>
                }
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  '& .MuiImageListItemBar-title': {
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  },
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      {paginator}
    </Box>
  );
};

export default DocumentGallery;
