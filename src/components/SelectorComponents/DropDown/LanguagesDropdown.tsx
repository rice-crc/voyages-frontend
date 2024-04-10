import { useState, MouseEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ArrowDropDown } from '@mui/icons-material';
import { LanguageOptions } from '@/utils/functions/languages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setLanguages } from '@/redux/getLanguagesSlice';
import { setBlogPost } from '@/redux/getBlogDataSlice';
import { BlogDataProps } from '@/share/InterfaceTypesBlog';
import { usePageRouter } from '@/hooks/usePageRouter';

export default function LanguagesDropdown() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { styleName } = usePageRouter()
  const { language } = useSelector((state: RootState) => state.getLanguages);
  const post = useSelector(
    (state: RootState) => state.getBlogData.post as BlogDataProps
  );

  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (value: string) => {
    dispatch(setLanguages(value));
    dispatch(setBlogPost(post as BlogDataProps));
    localStorage.setItem('languages', value);
  };

  return (
    <div className="select-languages">
      <Button
        id="fade-button"
        style={{ color: styleName ? '#ffffff' : '#000', fontSize: '1rem', fontWeight: 600 }}
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
        {language.toUpperCase()}
      </Button>
      <Menu
        id="fade-menu"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {LanguageOptions.map((lag) => (
          <MenuItem
            key={lag.language}
            onClick={() => handleChangeLanguage(lag.value)}
          >
            {lag.language}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
