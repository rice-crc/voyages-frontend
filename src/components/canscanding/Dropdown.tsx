import  {
  forwardRef,
  ReactElement,
  MouseEvent,
  useState,
  useRef,
  MutableRefObject,
  ReactNode,
  createElement,
  Children,
  cloneElement,
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
      keepOpen: keepOpenGlobal,
      isOpen: controlledIsOpen,
      onOpen: onControlledOpen,
    },
    ref
  ) => {
    const [isInternalOpen, setInternalOpen] = useState<null | HTMLElement>(
      null
    );

    const isOpen = controlledIsOpen || isInternalOpen !== null;
    let anchorRef = useRef<HTMLDivElement | null>(null);
    if (ref) {
      anchorRef = ref as MutableRefObject<HTMLDivElement | null>;
    }

    const handleOpen = (event: MouseEvent<HTMLDivElement, MouseEvent>) => {
      console.log("isOpen", isOpen)

      event.stopPropagation();
      if (menu.length) {
        onControlledOpen
          ? onControlledOpen(event)
          : setInternalOpen(event.currentTarget as HTMLElement);
      }
    };

    const handleClose = (event: MouseEvent<HTMLElement, MouseEvent>) => {
    
      event.stopPropagation();

      if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
        return;
      }
      handleForceClose();
    };

    const handleForceClose = () => {
  
      onControlledOpen ? onControlledOpen(null) : setInternalOpen(null);
    };

    const handleMenuItemClick = (
      event: MouseEvent<HTMLLIElement, MouseEvent>
    ) => {
      event.stopPropagation();
      if (!keepOpenGlobal) {
        setTimeout(handleForceClose, 0); // Close the menu in the next tick
      }
      handleClose(event);
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
        onClick: handleMenuItemClick,
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
