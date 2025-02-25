import { Property } from '@/models/properties';
import { Comment } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import TextArea from 'antd/es/input/TextArea';
import React, { useCallback, useState } from 'react';


export interface EntityPropertyChangeCommentBoxProps {
  property: Property;
  current?: string;
  onComment: (comment: string) => void;
}

export const EntityPropertyChangeCommentBox = ({
  property,
  current,
  onComment,
}: EntityPropertyChangeCommentBoxProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          position: 'absolute',
          right: '-15px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        aria-label="add comment"
      >
        <Comment />
      </IconButton>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <TextArea
          rows={3}
          value={current ?? ''}
          placeholder={`Please type your comments for ${property.label} here`}
          onChange={(e) => onComment(e.target.value)}
          style={{ width: '100%' }}
        />
      </Popover>
    </>
  );
};