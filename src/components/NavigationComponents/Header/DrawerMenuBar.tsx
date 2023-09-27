import {
  BaseFilter,
  DataSetCollectionProps,
} from '@/share/InterfactTypesDatasetCollection';
import { ListItemText, MenuItem, MenuList } from '@mui/material';
interface DrawerMenuBarProps {
  value: DataSetCollectionProps[];
  handleSelectDataset: (
    baseFilter: BaseFilter[],
    textHeder: string,
    textIntro: string,
    styleName: string,
    blocks: string[]
  ) => void;
}

export const DrawerMenuBar = (props: DrawerMenuBarProps) => {
  const { value, handleSelectDataset } = props;

  return value.map((item: DataSetCollectionProps, index: number) => {
    const { base_filter, headers, style_name, blocks } = item;
    return (
      <MenuList
        dense
        style={{ padding: 0 }}
        key={`${item.headers.label}-${index}`}
      >
        <MenuItem>
          <ListItemText
            className="menu-nposition: relative;
                right: 5.5%;av-bar"
            onClick={() =>
              handleSelectDataset(
                base_filter,
                headers.label,
                headers.text_introduce,
                style_name,
                blocks
              )
            }
            primary={item.headers.label}
          />
        </MenuItem>
      </MenuList>
    );
  });
};
