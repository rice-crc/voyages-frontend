import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ArrowDropDown } from '@mui/icons-material';
import { LanguageOptions } from '@/utils/functions/languages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BlogDataProps } from '@/share/InterfaceTypesBlog';
import { usePageRouter } from '@/hooks/usePageRouter';
import { translationDataBasePage } from '@/utils/functions/translationLanguages';
import { setDataBasesPage, setDataBasesPageLabel } from '@/redux/getDabasePagesSlice';

export default function DatabaseDropdown() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { databasePageValue, databasePageValueLabel } = useSelector((state: RootState) => state.getDabasePages);
  const { styleName: styleNameRoute, endpointPathEstimate } = usePageRouter()
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
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);

  const translatedPageValue = translationDataBasePage(languageValue)

  const handleChangeDataBasePages = (value: string, label: string) => {
    dispatch(setDataBasesPage(value));
    dispatch(setDataBasesPageLabel(label));
  };

  let colorText = '#ffffff'
  if (endpointPathEstimate === 'estimates') {
    colorText = '#ffffff'
  } else if (styleNameRoute === '' || styleNameRoute === 'PastHomePage') {
    colorText = 'rgba(0, 0, 0, 0.85)'
  }

  let fontSize = '0.80rem'
  if (styleNameRoute === 'PastHomePage') {
    fontSize = '1rem'
  } else if (!styleNameRoute) {
    fontSize = '1rem'
  } else if (styleNameRoute === 'estimates') {
    fontSize = '1rem'
  }
  return (
    <div className="select-languages">
      <Button
        id="fade-button"
        sx={{
          textTransform: 'none',
        }}
        style={{ color: colorText, fontSize: fontSize, fontWeight: 600 }}
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
                fontSize: '1rem',
              }}
            />
          </span>
        }
        onClick={handleClick}
      >
        {databasePageValueLabel}
      </Button>
      <Menu
        id="fade-menu"
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{ sx: { width: styleNameRoute ? null : '150px' } }}
      >
        {LanguageOptions.map((lag) => (
          <MenuItem
            style={{ fontSize: fontSize }}
            key={lag.language}
            onClick={() => handleChangeDataBasePages(lag.value, lag.lable)}
          >
            {databasePageValueLabel}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
