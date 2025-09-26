import '@/style/Nav.scss';
import { useEffect, useState } from 'react';

import { StarOutlined } from '@mui/icons-material';
import { Box } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Tooltip } from 'antd';

import { usePageRouter } from '@/hooks/usePageRouter';
import {
  getColorHoverBackgroundCollection,
  getHeaderColomnColor,
} from '@/utils/functions/getColorStyle';

import DropDownSaveSearch from './DropDownSaveSearch';

const SaveSearchComponent = () => {
  const { styleName } = usePageRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const buttonColor = getHeaderColomnColor(styleName!);
    const buttonHover = getColorHoverBackgroundCollection(styleName!);
    document.documentElement.style.setProperty('--saveSearch--', buttonColor);
    document.documentElement.style.setProperty(
      '--saveSearchHover--',
      buttonHover,
    );
  }, [styleName]);

  const text = <div style={{ fontSize: 14 }}>Save a search</div>;
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box>
        <button onClick={handleClick} className="save-sarch-content">
          <Tooltip placement="top" title={text} color="rgba(0, 0, 0, 0.75)">
            <StarOutlined />
          </Tooltip>
        </button>
        {isOpen ? (
          <Box className="save-search-box">
            <DropDownSaveSearch />
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );
};

export default SaveSearchComponent;
