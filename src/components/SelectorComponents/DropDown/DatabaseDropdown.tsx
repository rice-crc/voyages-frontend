import { useState, useEffect } from 'react';

import { CaretDownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
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
  const [headerTitle, setHeadTitle] = useState('');
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

  const handleMenuClick = (key: string) => {
    const selectedPage = PagesOptions.find(
      (option) => option.page.name === key,
    );
    if (selectedPage) {
      onClickReset();
      navigate(selectedPage.page.pathUrl);
    }
  };

  // Create menu items for dropdown
  const menuItems: MenuProps['items'] = PagesOptions.filter((value) => {
    const { label } = value.page;
    const labelPage = (label! as LabelFilterMeneList)[languageValue];
    return labelPage !== headerTitle;
  }).map((value) => {
    const { name, label } = value.page;
    const labelPage = (label! as LabelFilterMeneList)[languageValue];
    return {
      key: name,
      label: labelPage,
      style: { fontSize: '1rem' },
    };
  });

  const menu: MenuProps = {
    items: menuItems,
    onClick: ({ key }) => handleMenuClick(key),
  };

  // Base button styles
  const baseButtonStyle = {
    textTransform: 'none' as const,
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    color: 'inherit',
  };

  // Event handlers to maintain consistent styling
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.background = 'none';
    target.style.border = 'none';
    target.style.boxShadow = 'none';
    target.style.color = 'inherit';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.background = 'none';
    target.style.border = 'none';
    target.style.boxShadow = 'none';
    target.style.color = 'inherit';
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.background = 'none';
    target.style.border = 'none';
    target.style.boxShadow = 'none';
    target.style.color = 'inherit';
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.background = 'none';
    target.style.border = 'none';
    target.style.boxShadow = 'none';
    target.style.color = 'inherit';
  };

  return (
    <div className="select-languages">
      <Dropdown
        menu={menu}
        trigger={['click']}
        overlayStyle={{
          width: styleNameRoute ? 'auto' : '150px',
        }}
      >
        <Button
          className="button-header"
          style={baseButtonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {headerTitle}
          <CaretDownOutlined
            style={{
              fontSize: '0.9rem',
              marginLeft: '4px',
              marginTop: '4px',
              display: window.innerWidth >= 768 ? 'inline' : 'none',
            }}
          />
        </Button>
      </Dropdown>
    </div>
  );
}
