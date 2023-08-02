import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ArrowDropDown } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  setSearchBlogByValue,
  setSearchBlogTitle,
} from '@/redux/getBlogDataSlice';
import { SearchBlogData } from '@/share/InterfaceTypesBlog';

export default function SelectSearchBlogDropdown() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { searchTitle, searchValue } = useSelector(
    (state: RootState) => state.getBlogData
  );
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeSearch = (value: string, title: string) => {
    dispatch(setSearchBlogByValue(value));
    dispatch(setSearchBlogTitle(title));
  };

  return (
    <div>
      <Button
        id="fade-button"
        style={{ color: '#ffffff', fontSize: 12, fontWeight: 600 }}
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
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
        onClick={handleClick}
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
          <MenuItem
            key={value.tag}
            onClick={() => handleChangeSearch(value.tag, value.title)}
          >
            {value.search}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
