import { useState, MouseEvent, useCallback, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ArrowDropDown, Link } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  setSearchAutoKey,
  setSearchAutoValue,
  setSearchBlogTitle,
} from '@/redux/getBlogDataSlice';
import { SearchBlogData } from '@/share/InterfaceTypesBlog';
import { BLOGPAGE } from '@/share/CONST_DATA';
import { useParams } from 'react-router-dom';
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
        TransitionComponent={Fade}
      >
        {SearchBlogData.map((value) => (
          <div className="dropdown-item" key={value.tag}>
            {blogTitle || authorName ? (
              <a href={`/${BLOGPAGE}`}>
                <MenuItem
                  key={value.tag}
                  onClick={() => handleChangeSearch(value.tag, value.title)}
                >
                  {value.search}
                </MenuItem>
              </a>
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
