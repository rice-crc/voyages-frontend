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
} from "react";
import Menu from "@mui/material/Menu";
import { List } from "@mui/material";

interface DropdownProps {
  trigger: ReactElement;
  menu: ReactElement[];
  keepOpen?: boolean;
  isOpen?: boolean;
  onOpen?: (event: MouseEvent<Element, MouseEvent> | null) => void;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      menu,
      isOpen: controlledIsOpen,
      onOpen: onControlledOpen,
    },
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

      document.addEventListener("click", handleClose);

      return () => {
        document.removeEventListener("click", handleClose);
      };
    }, []);

    const handleOpen = (event: MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      if (menu.length) {
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

    const renderMenu = (
      menuItem: ReactElement,
      index: number
    ): ReactNode => {
      const { ...props } = menuItem.props;

      let extraProps: { parentMenuOpen: boolean } = { parentMenuOpen: isOpen };
      if (props.menu) {
        extraProps = {
          ...extraProps,
          parentMenuOpen: isOpen,
        };
      }
      return createElement(menuItem.type, {
        ...props,
        key: index,
        ...extraProps,
        children: props.menu
          ? Children.map(props.menu, renderMenu)
          : props.children,
      });
    };

    return (
      <>
        {cloneElement(trigger, {
          onClick: handleOpen,
          ref: anchorRef,
        })}
  
        <Menu
          anchorEl={isOpen ? anchorRef.current : null}
          open={isOpen}
          onClose={handleClose}
        >
          <List>{menu.map(renderMenu)}</List>
        </Menu>
      </>
    );
  }
);
