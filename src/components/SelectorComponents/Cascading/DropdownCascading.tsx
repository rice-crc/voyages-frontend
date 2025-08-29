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
      if (onControlledOpen) {
        onControlledOpen(null);
      } else {
        setInternalOpen(false);
      }
    };

    // Function that menu items can call to close the dropdown
    const closeMenu = () => {
      setTimeout(() => handleForceClose(), 100);
    };

    const convertToAntdMenuItems = (
      menuItems?: (ReactElement | any)[],
      parentKey: string = '',
    ): MenuProps['items'] => {
      if (!menuItems) return [];

      return menuItems.map((menuItem, index) => {
        // Check if it's a React element or a plain object
        const isReactElement = menuItem.props !== undefined;

        if (isReactElement) {
          // Handle React elements (your existing logic)
          const {
            onClick,
            children,
            menu: submenu,
            key,
            ...safeProps
          } = menuItem.props;

          const compositeKey = key || `${parentKey}-${index}`;

          const handleItemClick = (e: any) => {
            const mouseEvent = {
              currentTarget: e.domEvent?.currentTarget || {},
              stopPropagation: () => e.domEvent?.stopPropagation?.(),
              preventDefault: () => e.domEvent?.preventDefault?.(),
              ...safeProps,
            };

            if (onClick) {
              onClick(mouseEvent);
            }

            if (!submenu) {
              closeMenu();
            }
          };

          const menuItemConfig: any = {
            key: compositeKey,
            label: children,
            onClick: handleItemClick,
            ...safeProps,
          };

          if (submenu && Array.isArray(submenu)) {
            menuItemConfig.children = convertToAntdMenuItems(
              submenu,
              compositeKey,
            );
          }

          return menuItemConfig;
        } else {
          // Handle plain objects (from renderDropdownMenu)
          const { key, label, children, onClick, ...otherProps } = menuItem;
          const compositeKey = key || `${parentKey}-${index}`;

          const handleItemClick = (e: any) => {
            if (onClick) {
              const mouseEvent = {
                currentTarget: e.domEvent?.currentTarget || {},
                stopPropagation: () => e.domEvent?.stopPropagation?.(),
                preventDefault: () => e.domEvent?.preventDefault?.(),
                ...otherProps,
              };
              onClick(mouseEvent);
            }

            if (!children) {
              closeMenu();
            }
          };

          const menuItemConfig: any = {
            key: compositeKey,
            label,
            onClick: handleItemClick,
            ...otherProps,
          };

          if (children && Array.isArray(children)) {
            menuItemConfig.children = convertToAntdMenuItems(
              children,
              compositeKey,
            );
          }

          return menuItemConfig;
        }
      });
    };

    const menuConfig: MenuProps = {
      items: convertToAntdMenuItems(menu),
    };

    return (
      <div ref={ref}>
        <style>{`
        .ant-dropdown-menu-submenu-arrow {
          display: none !important;
        }
        .ant-dropdown-menu-item:hover {
          background-color: #f5f5f5 !important;
        }
        .column-selector-tooltip .ant-tooltip-inner {
          max-width: 300px;
          text-align: left;
        }
      `}</style>
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
