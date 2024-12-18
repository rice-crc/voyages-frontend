import { useState, MouseEvent, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { ArrowDropDown } from '@mui/icons-material';
import { PagesOptions } from '@/utils/functions/languages';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@/hooks/usePageRouter';
import { translationDataBasePage } from '@/utils/functions/translationLanguages';
import { LabelFilterMeneList } from '@/share/InterfaceTypes';
import { Link } from 'react-router-dom';
import {
  ENSALVEDROUTE,
  ENSALVERSROUTE,
  VOYAGEPATHENPOINT,
} from '@/share/CONST_DATA';

interface DatabaseDropdownProps {
  onClickReset: () => void;
}

export default function DatabaseDropdown(props: DatabaseDropdownProps) {
  const { onClickReset } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [headerTitle, setHeadTitle] = useState('');
  const open = Boolean(anchorEl);
  const {
    styleName: styleNameRoute,
    endpointPath,
    endpointPeopleDirect,
  } = usePageRouter();

  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages
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
  }, [headerTitle, languageValue]);

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
        // style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}
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
        className="enslaved-header-subtitle"
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
              <Link
                to={pathUrl}
                onClick={onClickReset}
                style={{
                  textDecoration: 'none',
                  color: '#000',
                }}
              >
                {labelPage!}
              </Link>
            </MenuItem>
          ) : null;
        })}
      </Menu>
    </div>
  );
}
