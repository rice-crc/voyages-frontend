import {RootState} from '@/redux/store';
import {LabelFilterMeneList} from '@/share/InterfaceTypes';
import {
  BaseFilter,
  BlockCollectionProps,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import {ListItemText, MenuItem, MenuList} from '@mui/material';
import {useSelector} from 'react-redux';
interface DrawerMenuBarProps {
  value: DataSetCollectionProps[];
  handleSelectDataset: (
    baseFilter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: BlockCollectionProps[],
    filterMenuFlatfile?: string,
    tableFlatfile?: string
  ) => void;
}

export const DrawerMenuBar = (props: DrawerMenuBarProps) => {
  const {value, handleSelectDataset} = props;

  return (
    <>{value.map((item: DataSetCollectionProps, index: number) => {
      const {
        base_filter,
        headers,
        style_name,
        blocks,
        table_flatfile,
        filter_menu_flatfile,
      } = item;
      const {languageValue} = useSelector((state: RootState) => state.getLanguages);
      const {label: headerLable} = headers;
      const menuLabel = (headerLable as LabelFilterMeneList)[languageValue];
      return (
        <>
          <MenuList
            dense
            style={{padding: 0}}
            key={`${menuLabel}-${index}`}
          >
            <MenuItem>
              <ListItemText
                className="menu-nposition: relative;
                  right: 5.5%;av-bar"
                onClick={() =>
                  handleSelectDataset(
                    base_filter,
                    menuLabel,
                    headers.text_introduce,
                    style_name,
                    blocks,
                    filter_menu_flatfile,
                    table_flatfile
                  )
                }
                primary={menuLabel}
              />
            </MenuItem>
          </MenuList></>
      );
    })}
    </>
  );
};
