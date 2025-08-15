import { Button } from 'antd';
import { useSelector } from 'react-redux';

import { usePageRouter } from '@/hooks/usePageRouter';
import { RootState } from '@/redux/store';
import { LabelFilterMeneList } from '@/share/InterfaceTypes';
import {
  BaseFilter,
  BlockCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import { getColorTextCollection } from '@/utils/functions/getColorStyle';

interface DatasetButtonProps {
  item: any;
  index: any;
  handleSelectDataset: (
    baseFilter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: BlockCollectionProps[],
    filterMenuFlatfile?: string,
    tableFlatfile?: string,
    cardFlatfile?: string,
  ) => void;

  getColorBoxShadow: (item: string) => string;
  getColorBTNBackground: (item: string) => string;
  getColorHover: (item: string) => string;
}

export const DatasetButton = (props: DatasetButtonProps) => {
  const {
    getColorBoxShadow,
    item,
    index,
    handleSelectDataset,
    getColorBTNBackground,
    getColorHover,
  } = props;

  const { languageValue } = useSelector(
    (state: RootState) => state.getLanguages,
  );

  const {
    base_filter,
    headers,
    style_name,
    blocks,
    table_flatfile,
    filter_menu_flatfile,
    card_flatfile,
  } = item;

  const { label: labelDataset } = headers;
  const { styleName } = usePageRouter();
  const menuLabel = (labelDataset as LabelFilterMeneList)[languageValue];
  const isDisabled = styleName === style_name;

  // Base button styles
  const baseButtonStyle = {
    color: getColorTextCollection(style_name),
    fontWeight: 600,
    height: '32px',
    fontSize: '0.80rem',
    textTransform: 'unset' as const,
    margin: '0 2px',
    backgroundColor: getColorBTNBackground(style_name),
    border: 'none',
    boxShadow: isDisabled ? getColorBoxShadow(styleName!) : 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
  };

  // Disabled button styles
  const disabledButtonStyle = {
    ...baseButtonStyle,
    backgroundColor: getColorBTNBackground(style_name),
    color: '#fff',
    boxShadow: getColorBoxShadow(styleName!),
    cursor: 'not-allowed',
  };

  return (
    <Button
      key={`${menuLabel}-${index}`}
      disabled={isDisabled}
      onClick={() =>
        handleSelectDataset(
          base_filter,
          menuLabel,
          headers.text_introduce,
          style_name,
          blocks,
          filter_menu_flatfile,
          table_flatfile,
          card_flatfile,
        )
      }
      style={isDisabled ? disabledButtonStyle : baseButtonStyle}
    >
      <div>{menuLabel}</div>
    </Button>
  );
};
