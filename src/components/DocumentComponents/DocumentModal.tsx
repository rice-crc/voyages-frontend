// DocumentModal.tsx - Complete Mirador-style interface

import React, { useState, useCallback, useEffect } from 'react';

import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  GetApp as DownloadIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Button,
  Toolbar,
  Paper,
  CircularProgress,
} from '@mui/material';

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  document: {
    key: string;
    label: string;
    thumb?: string;
    zoteroGroupId: string;
    zoteroItemId: string;
  } | null;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
  open,
  onClose,
  document,
}) => {
  // Core states
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);

  // Image handling states
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Panning states
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * 1.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5));
  }, []);

  // External link handlers
  const handleFullscreen = useCallback(() => {
    if (document) {
      const zoteroUrl = `https://www.zotero.org/groups/${document.zoteroGroupId}/items/${document.zoteroItemId}`;
      window.open(zoteroUrl, '_blank', 'noopener,noreferrer');
    }
  }, [document]);

  const handleDownload = useCallback(() => {
    if (document) {
      // Attempt to download or open attachment
      const downloadUrl = `https://api.zotero.org/groups/${document.zoteroGroupId}/items/${document.zoteroItemId}/file`;
      window.open(downloadUrl, '_blank');
    }
  }, [document]);

  // Image event handlers
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  // Pan/drag functionality
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsPanning(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    },
    [zoom, pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning && zoom > 1) {
        setPan({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y,
        });
      }
    },
    [isPanning, zoom, startPan],
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          event.preventDefault();
          handleZoomIn();
          break;
        case '-':
          event.preventDefault();
          handleZoomOut();
          break;
        case 'i':
        case 'I':
          event.preventDefault();
          setShowInfo((prev) => !prev);
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          handleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, onClose, handleZoomIn, handleZoomOut, handleFullscreen]);

  // Reset states when document changes
  useEffect(() => {
    if (document) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setImageLoading(true);
      setImageError(false);
      setShowInfo(false);
    }
  }, [document]);

  if (!document) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="document-modal-title"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '95vw',
          height: '95vh',
          bgcolor: '#f5f5f5', // Light gray background like Mirador
          borderRadius: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 24,
        }}
      >
        {/* Top Toolbar - Mirador Style */}
        <Paper
          elevation={1}
          sx={{
            bgcolor: '#4a5568', // Dark gray header
            color: 'white',
            borderRadius: 0,
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              minHeight: 48,
              px: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Left side - Title */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                fontSize: '0.9rem',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {document.label}
            </Typography>

            {/* Right side - Action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setShowInfo(!showInfo)}
                sx={{ color: 'white' }}
                title="Toggle info"
              >
                <InfoIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleZoomOut}
                sx={{ color: 'white' }}
                title="Zoom out"
              >
                <ZoomOutIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleZoomIn}
                sx={{ color: 'white' }}
                title="Zoom in"
              >
                <ZoomInIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleDownload}
                sx={{ color: 'white' }}
                title="Download"
              >
                <DownloadIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={handleFullscreen}
                sx={{ color: 'white' }}
                title="View in Zotero"
              >
                <FullscreenIcon fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={onClose}
                sx={{ color: 'white', ml: 1 }}
                title="Close"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </Paper>

        {/* Document Viewer Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            bgcolor: '#2d3748', // Dark background like Mirador
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Main Document Display */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              position: 'relative',
              cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {document.thumb && !imageError ? (
              <Box
                sx={{
                  border: '1px solid #4a5568',
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  bgcolor: 'white',
                  position: 'relative',
                }}
              >
                {imageLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress size={40} sx={{ color: '#4a5568' }} />
                  </Box>
                )}
                <img
                  src={document.thumb}
                  alt={document.label}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transformOrigin: 'center',
                    transition: isPanning
                      ? 'none'
                      : 'transform 0.2s ease-in-out',
                    display: 'block',
                    opacity: imageLoading ? 0.3 : 1,
                    userSelect: 'none',
                    pointerEvents: 'none',
                  }}
                  draggable={false}
                />
              </Box>
            ) : (
              // Fallback for documents without thumbnails or image errors
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'white',
                  borderRadius: 1,
                  minWidth: 300,
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: '#2d3748' }}>
                  {imageError ? 'Image not available' : 'Document Preview'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#4a5568' }}>
                  {document.label}
                </Typography>
                {imageError && (
                  <Typography
                    variant="caption"
                    sx={{ mb: 3, color: '#e53e3e' }}
                  >
                    Failed to load document thumbnail
                  </Typography>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleFullscreen}
                    startIcon={<FullscreenIcon />}
                    sx={{
                      bgcolor: '#4a5568',
                      '&:hover': { bgcolor: '#2d3748' },
                    }}
                  >
                    View in Zotero
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleDownload}
                    startIcon={<DownloadIcon />}
                    sx={{
                      borderColor: '#4a5568',
                      color: '#4a5568',
                      '&:hover': { borderColor: '#2d3748', color: '#2d3748' },
                    }}
                  >
                    Download
                  </Button>
                </Box>
              </Paper>
            )}
          </Box>

          {/* Side Info Panel (optional) */}
          {showInfo && (
            <Paper
              sx={{
                width: 300,
                bgcolor: 'white',
                borderLeft: '1px solid #e2e8f0',
                p: 2,
                overflow: 'auto',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
                Document Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Title:
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  {document.label}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Source:
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Zotero Group {document.zoteroGroupId}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Item ID:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4a5568',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                  }}
                >
                  {document.zoteroItemId}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>

        {/* Bottom status bar */}
        <Paper
          elevation={1}
          sx={{
            bgcolor: '#f7fafc',
            borderTop: '1px solid #e2e8f0',
            borderRadius: 0,
            py: 1,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#4a5568' }}>
              Zoom: {Math.round(zoom * 100)}%{' '}
              {zoom > 1 && '• Click and drag to pan'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#4a5568' }}>
              1 of 1 • 1 {open && '• ESC to close, +/- to zoom, I for info'}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Modal>
  );
};

export default DocumentModal;
