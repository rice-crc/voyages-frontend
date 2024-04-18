import React, { useEffect, useRef, forwardRef, useContext, ReactNode, HTMLAttributes } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, Theme } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import { RenderRowProps } from '@/share/InterfaceTypes';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { ListSubheader } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setIsLoadingList, } from "@/redux/getAutoCompleteSlice";

const LISTBOX_PADDING = 8;

function renderRow(props: RenderRowProps) {
    const { data, index, style } = props;
    return React.cloneElement(data[index] as React.ReactElement, {
        style: {
            ...style,
            top: +(style.top!) + LISTBOX_PADDING!,
            padding: LISTBOX_PADDING + 5
        },
    });
}


const OuterElementContext = React.createContext<Record<string, unknown>>({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache<T>(data: T[]) {
    const ref = useRef<VariableSizeList>(null);
    useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
interface CustomAutoListboxProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
const CustomAutoListboxComponent = forwardRef<HTMLDivElement, CustomAutoListboxProps>((props, ref) => {
    const { children, ...other } = props;
    const dispatch: AppDispatch = useDispatch();
    const itemData = React.Children.toArray(children);
    const theme = useTheme<Theme>();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;
    const gridRef = useResetCache([itemCount]);

    const getItemSize = (child: any) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }
        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 14 * itemSize;
        }
        return itemData.map(getItemSize).reduce((a, b) => a + b, 0);
    };


    return (
        <div   {...other} ref={ref} style={{ overflowY: 'hidden' }} >
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    onItemsRendered={({ visibleStopIndex }) => {
                        if (visibleStopIndex === itemData.length - 1) {
                            dispatch(setIsLoadingList(true))
                        } else {
                            dispatch(setIsLoadingList(false))
                        }
                    }}
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef as React.RefObject<VariableSizeList>}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={getItemSize}
                    overscanCount={2}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
})

export default CustomAutoListboxComponent;