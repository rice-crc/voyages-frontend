import {
  forwardRef,
  ReactElement,
  MouseEvent,
  useState,
  useRef,
  cloneElement,
  useEffect,
} from 'react';

import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

interface DropdownProps {
  trigger: ReactElement;
  menu?: ReactElement[];
  keepOpen?: boolean;
  isOpen?: boolean;
  onOpen?: (event: MouseEvent<Element, MouseEvent> | null) => void;
}

export const DropdownCascading = forwardRef<HTMLDivElement, DropdownProps>(
  (
    { trigger, menu, isOpen: controlledIsOpen, onOpen: onControlledOpen },
    ref,
  ) => {
    const [isInternalOpen, setInternalOpen] = useState<boolean>(false);

    const isOpen = controlledIsOpen || isInternalOpen;
    const anchorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handleGlobalClick = (event: MouseEvent) => {
        // Only close if clicking outside the dropdown
        if (
          anchorRef.current &&
          !anchorRef.current.contains(event.target as Node)
        ) {
          handleForceClose();
        }
      };

      // Use capture phase to ensure this runs before other handlers
      document.addEventListener('click', handleGlobalClick as any, true);

      return () => {
        document.removeEventListener('click', handleGlobalClick as any, true);
      };
    }, []);

    const handleOpenChange = (open: boolean) => {
      if (onControlledOpen) {
        onControlledOpen(open ? ({} as any) : null);
      } else {
        setInternalOpen(open);
      }
    };

    const handleForceClose = () => {
      onControlledOpen ? onControlledOpen(null) : setInternalOpen(false);
    };

    // Function that menu items can call to close the dropdown
    const closeMenu = () => {
      setTimeout(() => handleForceClose(), 100); // Small delay to ensure click event completes
    };

    // Convert ReactElement menu items to Ant Design MenuProps format
    const convertToAntdMenuItems = (
      menuItems?: ReactElement[],
    ): MenuProps['items'] => {
      if (!menuItems) return [];

      return menuItems.map((menuItem, index) => {
        const { onClick, children, menu: submenu, ...props } = menuItem.props;

        // Handle click event by combining original handler with close function
        const handleItemClick = (e: any) => {
          // Convert the click info to a mouse event-like object
          const mouseEvent = {
            currentTarget: e.domEvent?.currentTarget || {},
            stopPropagation: () => e.domEvent?.stopPropagation?.(),
            preventDefault: () => e.domEvent?.preventDefault?.(),
            ...props, // Include data attributes and other props
          };

          // Call the original onClick if it exists
          if (onClick) {
            onClick(mouseEvent);
          }

          // Don't close dropdown if this item has a submenu
          if (!submenu) {
            closeMenu();
          }
        };

        const menuItemConfig: any = {
          key: props.key || index,
          label: children,
          onClick: handleItemClick,
          ...props, // Spread other props like data attributes
        };

        // Handle submenus recursively
        if (submenu && Array.isArray(submenu)) {
          menuItemConfig.children = convertToAntdMenuItems(submenu);
        }

        return menuItemConfig;
      });
    };

    const menuConfig: MenuProps = {
      items: convertToAntdMenuItems(menu),
    };

    return (
      <div ref={ref}>
        <Dropdown
          menu={menuConfig}
          trigger={['click']}
          open={isOpen}
          onOpenChange={handleOpenChange}
          placement="bottomLeft"
        >
          {cloneElement(trigger, {
            ref: anchorRef,
          })}
        </Dropdown>
      </div>
    );
  },
);

DropdownCascading.displayName = 'DropdownCascading';
