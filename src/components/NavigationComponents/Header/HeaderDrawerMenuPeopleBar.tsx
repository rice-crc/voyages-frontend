import { RootState } from '@/redux/store';
import { LabelFilterMeneList } from '@/share/InterfaceTypes';
import { ListItemText, MenuItem, MenuList } from '@mui/material';
import { useSelector } from 'react-redux';


type HeaderItem = {
  label: LabelFilterMeneList;
};

type HeaderType = {
  header: HeaderItem[];
};
interface DrawerMenuPeopleBarProps {
  value: HeaderType;
  handleSelectMenuItems: (item: string) => void;
}

export const HeaderDrawerMenuPeopleBar = (props: DrawerMenuPeopleBarProps) => {
  const { value, handleSelectMenuItems } = props;
  const { languageValue } = useSelector((state: RootState) => state.getLanguages);


  return value.header?.map((title, index) => {
    const { label: textLabel } = title;
    const textTitle = (textLabel as LabelFilterMeneList)[languageValue];
    return (
      <MenuList dense style={{ padding: 0 }} key={`${textLabel}-${index}`}>
        <MenuItem>
          <ListItemText
            className="menu-nposition: relative;
                  right: 5.5%;av-bar"
            onClick={() => handleSelectMenuItems(textTitle)}
            primary={textTitle}
          />
        </MenuItem>
      </MenuList>
    );
  });
};
