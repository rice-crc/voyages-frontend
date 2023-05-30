export interface HeaderNavBarMenuProps {
    setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
    isFilter: boolean;
    window?: () => Window;
}


export interface NavProps {
    setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
    isFilter: boolean;
    window?: () => Window;
}

export interface CanscandingMenuProps {
    setIsFilter?: React.Dispatch<React.SetStateAction<boolean>>;
    isFilter?: boolean;
    window?: () => Window;
}