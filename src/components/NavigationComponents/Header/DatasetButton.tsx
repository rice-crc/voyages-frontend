import { Button } from '@mui/material';
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
  return (
    <Button
      key={`${menuLabel}-${index}`}
      disabled={styleName === style_name}
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
      sx={{
        color: getColorTextCollection(style_name),
        fontWeight: 600,
        height: 32,
        fontSize: '0.80rem',
        textTransform: 'unset',
        margin: '0 2px',
        backgroundColor: getColorBTNBackground(style_name),
        '&:hover': {
          backgroundColor: getColorHover(style_name),
          color: getColorBTNBackground(style_name),
        },
        '&:disabled': {
          backgroundColor: getColorBTNBackground(style_name),
          color: '#fff',
          boxShadow: getColorBoxShadow(styleName!),
          cursor: 'not-allowed',
        },
      }}
    >
      <div>{menuLabel}</div>
    </Button>
  );
};
