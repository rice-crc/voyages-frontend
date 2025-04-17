import {
  forwardRef,
  ReactElement,
  MouseEvent,
  useState,
  useRef,
  ReactNode,
  createElement,
  Children,
  cloneElement,
  useEffect,
} from 'react';
import Menu from '@mui/material/Menu';
import { List } from '@mui/material';

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
    ref
  ) => {
    const [isInternalOpen, setInternalOpen] = useState<HTMLElement | null>(
      null
    );

    const isOpen = controlledIsOpen || isInternalOpen !== null;
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

    const handleOpen = (event: MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      if (menu?.length) {
        onControlledOpen
          ? onControlledOpen(event)
          : setInternalOpen(event.currentTarget);
      }
    };

    const handleClose = () => {
      handleForceClose();
    };

    const handleForceClose = () => {
      onControlledOpen ? onControlledOpen(null) : setInternalOpen(null);
    };

    // Function that menu items can call to close the dropdown
    const closeMenu = () => {
      setTimeout(() => handleForceClose(), 100); // Small delay to ensure click event completes
    };

    const renderMenu = (menuItem: ReactElement, index: number): ReactNode => {
      const { parentMenuOpen, onClick, ...props } = menuItem.props;
      
      // Prepare extra props for the menu item
      let extraProps = {};
      if (props.menu) {
        extraProps = {
          parentMenuOpen: isOpen,
        };
      }

      // Handle click event by combining original handler with close function
      const handleItemClick = (e: MouseEvent) => {
        // Call the original onClick if it exists
        if (onClick) {
          onClick(e);
        }
        
        // Don't close dropdown if this item has a submenu
        if (!props.menu) {
          closeMenu();
        }
      };

      const allowedComponents = [
        'li',
        'yourCustomComponentType',
        'otherCustomComponentType',
      ];

      const filteredProps = {
        ...props,
        onClick: handleItemClick, // Add our combined click handler
        ...(allowedComponents.includes(String(menuItem.type))
          ? extraProps
          : {}),
      };

      return createElement(menuItem.type, {
        ...filteredProps,
        key: index,
        children: props.menu
          ? Children.map(props.menu, (child, i) => renderMenu(child, i))
          : props.children,
      });
    };

    return (
      <div ref={ref}>
        {cloneElement(trigger, {
          onClick: handleOpen,
          ref: anchorRef,
        })}

        <Menu
          anchorEl={isOpen ? anchorRef.current : null}
          open={isOpen}
          onClose={handleClose}
          disableScrollLock={true}
          // Adding these props to improve behavior
          keepMounted
          MenuListProps={{
            onClick: (e) => e.stopPropagation() // Prevent clicks inside menu from closing immediately
          }}
        >
          <List>{menu?.map(renderMenu)}</List>
        </Menu>
      </div>
    );
  }
);