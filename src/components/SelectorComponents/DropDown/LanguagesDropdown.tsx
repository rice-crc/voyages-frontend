import { useState, MouseEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ArrowDropDown } from '@mui/icons-material';
import { LanguageOptions } from '@/utils/functions/languages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setConfigureColumns, setLanguages, setLanguagesLabel, setResetAllLanguage } from '@/redux/getLanguagesSlice';
import { setBlogPost } from '@/redux/getBlogDataSlice';
import { BlogDataProps } from '@/share/InterfaceTypesBlog';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setCurrentVoyagesBlockName } from '@/redux/getScrollPageSlice';

export default function LanguagesDropdown() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { styleName } = usePageRouter()
  const { languageValueLabel } = useSelector((state: RootState) => state.getLanguages);
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

  const handleChangeLanguage = (value: string, label: string) => {
    dispatch(setLanguages(value));
    dispatch(setLanguagesLabel(label));
    dispatch(setBlogPost(post as BlogDataProps));
    if (value === 'en') {
      dispatch(setConfigureColumns('Configure Columns'))
      dispatch(setResetAllLanguage('Reset all'))
      // dispatch(setCurrentVoyagesBlockName(currentBlockName));
    } else if (value === 'es') {
      dispatch(setConfigureColumns('Configurar columnas'))
      dispatch(setResetAllLanguage('Restablecer todo'))
    } else if (value === 'pt') {
      dispatch(setConfigureColumns('Configurar colunas'))
      dispatch(setResetAllLanguage('Resetar tudo'))
    }
    localStorage.setItem('languages', value);
  };

  return (
    <div className="select-languages">
      <Button
        id="fade-button"
        sx={{
          textTransform: 'none',
        }}
        style={{ color: styleName ? '#ffffff' : '#000', fontSize: styleName ? '0.80rem' : '1.15rem', fontWeight: 600 }}
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
                fontSize: '1.1rem',
              }}
            />
          </span>
        }
        onClick={handleClick}
      >
        {languageValueLabel}
      </Button>
      <Menu
        id="fade-menu"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{ sx: { width: styleName ? null : '150px' } }}
      >
        {LanguageOptions.map((lag) => (
          <MenuItem
            style={{ fontSize: styleName ? '0.85rem' : '1.15rem' }}
            key={lag.language}
            onClick={() => handleChangeLanguage(lag.value, lag.lable)}
          >
            {lag.language}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
