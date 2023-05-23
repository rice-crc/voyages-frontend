import React, { forwardRef, ReactElement, MouseEvent, useState, useRef, MutableRefObject, ReactNode, createElement, Children, cloneElement } from "react";
import Menu, { MenuProps } from "@mui/material/Menu";

interface DropdownProps {
  trigger: ReactElement;
  menu: ReactElement[];
  keepOpen?: boolean;
  isOpen?: boolean;
  onOpen?: (event: MouseEvent<Element, MouseEvent> | null) => void;
  minWidth?: number;

}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      menu,
      keepOpen: keepOpenGlobal,
      isOpen: controlledIsOpen,
      onOpen: onControlledOpen,
      minWidth,
    },
    ref
  ) => {
    const [isInternalOpen, setInternalOpen] = useState<null | HTMLElement>(null);

    const isOpen = controlledIsOpen || isInternalOpen !== null;

    let anchorRef = useRef<HTMLDivElement | null>(null);
    if (ref) {
      anchorRef = ref as MutableRefObject<HTMLDivElement | null>;
    }

    const handleOpen = (event: MouseEvent<Element, MouseEvent>) => {
      event.stopPropagation();

      if (menu.length) {
        onControlledOpen
          ? onControlledOpen(event)
          : setInternalOpen(event.currentTarget as HTMLElement);
      }
    };

    const handleClose = (event: MouseEvent<Element, MouseEvent>) => {
      event.stopPropagation();

      if (anchorRef.current && anchorRef.current?.contains(event.target as Node)) {
        return;
      }

      handleForceClose();
    };

    const handleForceClose = () => {
      onControlledOpen ? onControlledOpen(null) : setInternalOpen(null);
    };

    const renderMenu = (menuItem: ReactElement, index: number): ReactNode => {
      const { keepOpen: keepOpenLocal, ...props } = menuItem.props;

      let extraProps: { parentMenuOpen: boolean } = { parentMenuOpen: isOpen };
      if (props.menu) {
        extraProps = {
          ...extraProps,
          parentMenuOpen: isOpen
        };
      }

      return createElement(menuItem.type, {
        ...props,
        key: index,
        ...extraProps,
        onClick: (event: MouseEvent<Element, MouseEvent>) => {
          event.stopPropagation();

          if (!keepOpenGlobal && !keepOpenLocal) {
            handleClose(event);
          }

          if (menuItem.props.onClick) {
            menuItem.props.onClick(event);
          }
        },
        children: props.menu
          ? Children.map(props.menu, renderMenu)
          : props.children
      });
    };

    return (
      <>
        {cloneElement(trigger, {
          onClick: isOpen ? handleForceClose : handleOpen,
          ref: anchorRef
        })}

        <Menu
          PaperProps={{ sx: { minWidth: minWidth ?? 0 } }}
          anchorEl={isOpen ? anchorRef.current : null}
          open={isOpen}
          onClose={handleClose}
        >
          {Children.map(menu, renderMenu)}
        </Menu>
      </>
    );
  }
);
