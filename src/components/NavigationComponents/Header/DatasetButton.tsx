import { BaseFilter } from '@/share/InterfactTypesDatasetCollection';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { usePageRouter } from '@/hooks/usePageRouter';

interface DatasetButtonProps {
  item: any;
  index: any;
  handleSelectDataset: (
    baseFilter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[],
    filterMenuFlatfile?: string,
    tableFlatfile?: string
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
  const {
    base_filter,
    headers,
    style_name,
    blocks,
    table_flatfile,
    filter_menu_flatfile,
  } = item;
  const { styleName } = usePageRouter()

  return (
    <Button
      key={`${item}-${index}`}
      disabled={styleName === style_name}
      onClick={() =>
        handleSelectDataset(
          base_filter,
          headers.label,
          headers.text_introduce,
          style_name,
          blocks,
          filter_menu_flatfile,
          table_flatfile
        )
      }
      sx={{
        color: '#000',
        fontWeight: 600,
        height: 32,
        fontSize: 12,
        margin: '0 2px',
        backgroundColor: getColorBTNBackground(style_name),
        '&:hover': {
          backgroundColor: getColorHover(style_name),
        },
        '&:disabled': {
          backgroundColor: getColorBTNBackground(style_name),
          color: '#fff',
          boxShadow: getColorBoxShadow(styleName!),
          cursor: 'not-allowed',
        },
      }}
    >
      <div>{headers.label}</div>
    </Button>
  );
};
