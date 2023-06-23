import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
  RefObject,
  MouseEvent,
} from "react";
import { Menu, MenuItem } from "@mui/material";
import { ArrowRight } from "@mui/icons-material";
import { ChildrenFilter } from "@/share/InterfaceTypes";

interface NestedMenuItemProps {
  parentMenuOpen?: boolean;
  label?: string;
  varName?: string | undefined;
  type?: string | undefined;
  rightIcon?: JSX.Element;
  keepOpen?: boolean;
  children: React.ReactNode;
  childrenFilter?: ChildrenFilter;
  customTheme?: any;
  className?: string;
  tabIndex?: number;
  ContainerProps?: React.HTMLAttributes<HTMLDivElement> & {
    ref?: RefObject<HTMLDivElement>;
  };
  rightAnchored?: boolean;
  disabled?: boolean;
  onClickMenu: (
    event: MouseEvent<HTMLLIElement> | MouseEvent<HTMLDivElement>
  ) => void;
}

const NestedMenuItem = forwardRef<any, NestedMenuItemProps>((props, ref) => {
  const {
    parentMenuOpen,
    label,
    rightIcon = <ArrowRight style={{ fontSize: 14 }} />,
    keepOpen,
    childrenFilter,
    varName,
    type,
    children,
    customTheme,
    className,
    tabIndex: tabIndexProp,
    ContainerProps: ContainerPropsProp = {},
    rightAnchored,
    disabled,
    onClickMenu,
    ...MenuItemProps
  } = props;

  const { ref: containerRefProp, ...ContainerProps } = ContainerPropsProp;

  const menuItemRef = useRef<any>(null);
  useImperativeHandle(ref, () => menuItemRef.current);

  const containerRef = useRef<any>(null);
  useImperativeHandle(containerRefProp as Ref<any>, () => containerRef.current);

  const menuContainerRef = useRef<any>(null);

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsSubMenuOpen(true);

    if (ContainerProps?.onMouseEnter) {
      ContainerProps.onMouseEnter(event);
    }
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsSubMenuOpen(false);

    if (ContainerProps?.onMouseLeave) {
      ContainerProps.onMouseLeave(event);
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (ContainerProps?.onClick) {
      ContainerProps.onClick(event);
      setIsSubMenuOpen(true);
    }
  };

  const isSubmenuFocused = () => {
    const active = containerRef.current?.ownerDocument?.activeElement;

    for (const child of menuContainerRef.current?.children ?? []) {
      if (child === active) {
        return true;
      }
    }
    return false;
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === containerRef.current) {
      setIsSubMenuOpen(true);
    }

    if (ContainerProps?.onFocus) {
      ContainerProps.onFocus(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      return;
    }

    if (isSubmenuFocused()) {
      event.stopPropagation();
    }

    const active = containerRef.current?.ownerDocument?.activeElement;

    if (event.key === "ArrowLeft" && isSubmenuFocused()) {
      containerRef.current?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      event.target === containerRef.current &&
      event.target === active
    ) {
      const firstChild = menuContainerRef.current?.children[0];
      firstChild?.focus();
    }
  };

  const open = isSubMenuOpen && parentMenuOpen;

  let tabIndex;
  if (!disabled) {
    tabIndex = tabIndexProp !== undefined ? tabIndexProp : -1;
  }

  return (
    <div
      {...ContainerProps}
      ref={containerRef}
      onFocus={handleFocus}
      tabIndex={tabIndex}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onClick={handleOnClick}
    >
      <MenuItem
        {...MenuItemProps}
        data-open={!!open || undefined}
        className={className}
        ref={menuItemRef}
        data-value={varName}
        data-type={type}
        data-label={label}
        onClick={onClickMenu}
      >
        {label}
        <div style={{ flexGrow: 1 }} />
        {children && rightIcon}
      </MenuItem>
      {children && (
        <Menu
          hideBackdrop
          style={{ pointerEvents: "none" }}
          anchorEl={menuItemRef.current}
          anchorOrigin={{
            vertical: "top",
            horizontal: rightAnchored ? "left" : "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: rightAnchored ? "right" : "left",
          }}
          sx={customTheme}
          open={!!open}
          autoFocus={false}
          disableAutoFocus
          disableEnforceFocus
          onClose={() => {
            setIsSubMenuOpen(false);
          }}
        >
          <div ref={menuContainerRef} style={{ pointerEvents: "auto" }}>
            {children}
          </div>
        </Menu>
      )}
    </div>
  );
});

export default NestedMenuItem;
