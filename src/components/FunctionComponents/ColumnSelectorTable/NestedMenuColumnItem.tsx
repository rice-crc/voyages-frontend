import React, { MouseEvent } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { MenuItemProps } from '@mui/material/MenuItem';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { useWindowSize } from '@react-hook/window-size';
import { maxWidthSize } from '@/utils/functions/maxWidthSize';
interface NestedMenuItemProps extends Omit<MenuItemProps, 'ref'> {
  label: React.ReactNode;
  rightIcon?: React.ReactNode;
  keepOpen?: boolean;
  children?: React.ReactNode;
  customTheme?: any;
  rightAnchored?: boolean;
  menu?: React.ReactElement[];
  onClickMenu?: (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => void;
}

const NestedMenuColumnItem = React.forwardRef<any, NestedMenuItemProps>(
  (props, ref) => {
    const {
      label,
      rightIcon = <ArrowRight style={{ fontSize: 16 }} />,
      keepOpen,
      children,
      customTheme,
      className,
      tabIndex: tabIndexProp,
      rightAnchored,
      onClickMenu,
      ...menuItemProps
    } = props;

    const menuItemRef = React.useRef<HTMLLIElement | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const menuContainerRef = React.useRef<HTMLDivElement>(null);
    const [isSubMenuOpen, setIsSubMenuOpen] = React.useState(false);
    const [width] = useWindowSize();
    const maxWidth = maxWidthSize(width);
    const handleMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
      setIsSubMenuOpen(true);
      if (menuItemProps?.onMouseEnter) {
        menuItemProps.onMouseEnter(event);
      }
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLLIElement>) => {
      setIsSubMenuOpen(false);

      if (menuItemProps?.onMouseLeave) {
        menuItemProps.onMouseLeave(event);
      }
    };

    const isSubmenuFocused = (): boolean => {
      const active = containerRef.current?.ownerDocument?.activeElement;

      for (const child of menuContainerRef.current?.children ?? []) {
        if (child === active) {
          return true;
        }
      }
      return false;
    };

    const handleFocus = (event: React.FocusEvent<HTMLLIElement>) => {
      if (event.target === menuItemRef.current) {
        setIsSubMenuOpen(true);
      }

      if (menuItemProps?.onFocus) {
        menuItemProps.onFocus(event);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
      if (event.key === 'Escape') {
        return;
      }

      if (isSubmenuFocused()) {
        event.stopPropagation();
      }

      const active = containerRef.current?.ownerDocument?.activeElement;

      if (event.key === 'ArrowLeft' && isSubmenuFocused()) {
        containerRef.current?.focus();
      }

      if (
        event.key === 'ArrowRight' &&
        event.target === containerRef.current &&
        event.target === active
      ) {
        const firstChild = menuContainerRef.current?.children[0];
        if (firstChild !== undefined) {
          firstChild;
        }
      }
    };

    const open = isSubMenuOpen;

    let tabIndex: number | undefined;
    if (!props.disabled) {
      tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
    }

    return (
      <MenuItem
        dense
        {...menuItemProps}
        data-open={!!open || undefined}
        className={className}
        ref={menuItemRef}
        onFocus={handleFocus}
        tabIndex={tabIndex}
        onMouseOver={maxWidth < 400 ? onClickMenu : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        {label}
        <div style={{ flexGrow: 1 }} />
        {rightIcon}
        <Menu
          hideBackdrop
          disableScrollLock={true}
          style={{ pointerEvents: 'none' }}
          anchorEl={menuItemRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: rightAnchored ? 'left' : 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: rightAnchored ? 'right' : 'left',
          }}
          open={!!open}
          autoFocus={false}
          disableAutoFocus
          disableEnforceFocus
          onClose={() => {
            setIsSubMenuOpen(false);
          }}
        >
          <div ref={menuContainerRef} style={{ pointerEvents: 'auto' }}>
            {children}
          </div>
        </Menu>
      </MenuItem>
    );
  }
);

export default NestedMenuColumnItem;
