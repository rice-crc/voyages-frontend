import { Drawer, DrawerProps } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';

const drawerWidth = 240;

interface StyledDrawerProps extends DrawerProps {
  open: boolean;
}

const StyledDrawer = styled(({ open, ...rest }: StyledDrawerProps) => <Drawer {...rest} />)(
    ({ theme, open, lang }: { theme: Theme; open: boolean; lang: string }) => ({
      width: open ? (lang === 'en' ? 280 : lang ==='pt' ? 320 : lang === 'es' ? 310 : 60) : 60,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      zIndex: 90,
      '& .MuiDrawer-paper': {
        width: open ? (lang === 'en' ? 280 : lang ==='pt' ? 320 : lang === 'es' ? 310 : 60) : 60,
        paddingTop: `${Number(theme.mixins.toolbar.minHeight || 95) + 40}px`,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
        backgroundColor: 'rgb(55, 148, 141)',
        color: 'white',
      },
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: 'white',
      },
      '& .MuiListItem-root:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    })
  );
  
  export default StyledDrawer;
  