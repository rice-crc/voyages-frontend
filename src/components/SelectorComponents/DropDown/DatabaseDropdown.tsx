import { useState, MouseEvent, useEffect } from 'react';

import { ArrowDropDown } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import {
  ENSALVEDROUTE,
  ENSALVERSROUTE,
  VOYAGEPATHENPOINT,
} from '@/share/CONST_DATA';
import { LabelFilterMeneList } from '@/share/InterfaceTypes';
import { PagesOptions } from '@/utils/functions/languages';
import { translationDataBasePage } from '@/utils/functions/translationLanguages';

interface DatabaseDropdownProps {
  onClickReset: () => void;
}

export default function DatabaseDropdown(props: DatabaseDropdownProps) {
  const { onClickReset } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [headerTitle, setHeadTitle] = useState('');
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const {
    styleName: styleNameRoute,
    endpointPath,
    endpointPeopleDirect,
  } = usePageRouter();

  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );
  const translatedPageValue = translationDataBasePage(languageValue);

  useEffect(() => {
    if (endpointPath === VOYAGEPATHENPOINT) {
      setHeadTitle(translatedPageValue.voyagesPage);
    } else if (endpointPeopleDirect === ENSALVEDROUTE) {
      setHeadTitle(translatedPageValue.enslavedPage);
    } else if (endpointPeopleDirect === ENSALVERSROUTE) {
      setHeadTitle(translatedPageValue.enslaversPage);
    }
  }, [endpointPath, endpointPeopleDirect, translatedPageValue]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="select-languages">
      <Button
        id="fade-button"
        sx={{
          textTransform: 'none',
        }}
        className="button-header"
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
                fontSize: '1.25rem',
              }}
            />
          </span>
        }
        onClick={handleClick}
      >
        {headerTitle}
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
        {PagesOptions.map((value) => {
          const { name, label, pathUrl } = value.page;
          const labelPage = (label! as LabelFilterMeneList)[languageValue];
          return labelPage !== headerTitle ? (
            <MenuItem style={{ fontSize: '1rem' }} key={name}>
              <button
                onClick={() => {
                  onClickReset();
                  navigate(pathUrl);
                  handleClose();
                }}
                style={{
                  textDecoration: 'none',
                  color: '#000',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  padding: 0,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                {labelPage!}
              </button>
            </MenuItem>
          ) : null;
        })}
      </Menu>
    </div>
  );
}
