import { useState, MouseEvent, useCallback } from 'react';

import { ArrowDropDown } from '@mui/icons-material';
import { Button, Menu, MenuItem, Fade } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { setSearchAutoKey, setSearchBlogTitle } from '@/redux/getBlogDataSlice';
import { RootState } from '@/redux/store';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { searchBlogData } from '@/share/InterfaceTypesBlog';

interface SelectBlogDropdownProps {
  handleReset: () => void;
}

export default function SelectBlogDropdown({
  handleReset,
}: SelectBlogDropdownProps) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { searchTitle } = useSelector((state: RootState) => state.getBlogData);
  const { blogTitle, authorName } = useParams();
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    handleReset();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeSearch = useCallback((value: string, title: string) => {
    dispatch(setSearchAutoKey(value));
    dispatch(setSearchBlogTitle(title));
  }, []);

  return (
    <div>
      <Button
        id="fade-button"
        style={{
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 600,
        }}
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="blog-select-tag"
        endIcon={
          <span>
            <ArrowDropDown
              sx={{
                display: {
                  xs: 'none',
                  sm: 'none',
                  md: 'flex',
                },
                fontSize: 16,
              }}
            />
          </span>
        }
      >
        {searchTitle}
      </Button>
      <Menu
        id="fade-menu"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {searchBlogData.map((value) => (
          <div className="dropdown-item" key={value.tag}>
            {blogTitle || authorName ? (
              <Link to={`/${BLOGPAGE}`}>
                <MenuItem
                  key={value.tag}
                  onClick={() => handleChangeSearch(value.tag, value.title)}
                >
                  {value.search}
                </MenuItem>
              </Link>
            ) : (
              <MenuItem
                key={value.tag}
                onClick={() => handleChangeSearch(value.tag, value.title)}
              >
                {value.search}
              </MenuItem>
            )}
          </div>
        ))}
      </Menu>
    </div>
  );
}
