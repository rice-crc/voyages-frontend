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
      const handleClose = (event: any) => {
        event.stopPropagation();

        if (
          anchorRef.current &&
          anchorRef.current.contains(event.target as Node)
        ) {
          return;
        }
        handleForceClose();
      };

      document.addEventListener('click', handleClose);

      return () => {
        document.removeEventListener('click', handleClose);
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

    const renderMenu = (menuItem: ReactElement, index: number): ReactNode => {
      const { parentMenuOpen, ...props } = menuItem.props;
      let extraProps = {};
      if (props.menu) {
        extraProps = {
          parentMenuOpen: isOpen,
        };
      }

      const allowedComponents = [
        'li',
        'yourCustomComponentType',
        'otherCustomComponentType',
      ];

      const filteredProps = {
        ...props,
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
        >
          <List>{menu?.map(renderMenu)}</List>
        </Menu>
      </div>
    );
  }
);
