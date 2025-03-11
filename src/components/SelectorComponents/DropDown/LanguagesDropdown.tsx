import { useState, MouseEvent } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ArrowDropDown } from '@mui/icons-material';
import { LanguageOptions } from '@/utils/functions/languages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setLanguages, setLanguagesLabel } from '@/redux/getLanguagesSlice';
import { setBlogPost } from '@/redux/getBlogDataSlice';
import { BlogDataProps } from '@/share/InterfaceTypesBlog';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setDataSetHeader } from '@/redux/getDataSetCollectionSlice';
import { checkHeaderTitleLanguages } from '@/utils/functions/checkHeaderTitleLanguages';
import { setDataSetPeopleEnslavedHeader } from '@/redux/getPeopleEnslavedDataSetCollectionSlice';
import { setDataSetEnslaversHeader } from '@/redux/getPeopleEnslaversDataSetCollectionSlice';

export default function LanguagesDropdown() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { languageValueLabel } = useSelector(
    (state: RootState) => state.getLanguages
  );
  const {
    styleName: styleNameRoute,
    endpointPathEstimate,
    endpointPath,
  } = usePageRouter();
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
    const hederTitleName = checkHeaderTitleLanguages(value, styleNameRoute!);
    dispatch(setDataSetHeader(hederTitleName));
    dispatch(setDataSetPeopleEnslavedHeader(hederTitleName));
    dispatch(setDataSetEnslaversHeader(hederTitleName));
    localStorage.setItem('languages', value);
  };

  let colorText = '#ffffff';
  if (
    endpointPathEstimate === 'estimates' ||
    endpointPath === 'accounts' ||
    endpointPath === 'contribute'
  ) {
    colorText = '#ffffff';
  } else if (styleNameRoute === '' || styleNameRoute === 'PastHomePage') {
    colorText = 'rgba(0, 0, 0, 0.85)';
  }
  const fontSize = '0.8rem';

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
        {languageValueLabel}
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
            onClick={() => handleChangeLanguage(lag.value, lag.lable)}
          >
            {lag.language}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
