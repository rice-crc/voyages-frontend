import { ListItemText, MenuItem, MenuList } from '@mui/material';
interface DrawerMenuPeopleBarProps {
  value?: string[];
  handleSelectMenuItems: (item: string) => void;
}

export const HeaderDrawerMenuPeopleBar = (props: DrawerMenuPeopleBarProps) => {
  const { value, handleSelectMenuItems } = props;

  return value?.map((item: string, index: number) => {
    return (
      <MenuList dense style={{ padding: 0 }} key={`${item}-${index}`}>
        <MenuItem>
          <ListItemText
            className="menu-nposition: relative;
                  right: 5.5%;av-bar"
            onClick={() => handleSelectMenuItems(item)}
            primary={item}
          />
        </MenuItem>
      </MenuList>
    );
  });
};
