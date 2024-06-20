import Popover from "@mui/material/Popover/Popover"
import { ReactNode, useState } from "react"

interface PopoverWrapperProps {
    children: ReactNode
    popoverContents: ReactNode
    padding?: number
}

const PopoverWrapper = ({ children, popoverContents, padding }: PopoverWrapperProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
    const onClose = () => setAnchorEl(null)
    return <div>
        <div onMouseEnter={e => setAnchorEl(e.currentTarget)} onMouseOut={onClose}>
            {children}
        </div>
        <Popover open={anchorEl !== null}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            style={{ pointerEvents: 'none' }}
            onClose={onClose}
            disableAutoFocus
            disableRestoreFocus>
            <div style={{ padding: padding ?? 0 }}>
                {popoverContents}
            </div>
        </Popover>
    </div>
}

export default PopoverWrapper