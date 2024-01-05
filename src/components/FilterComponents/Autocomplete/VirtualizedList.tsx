import { AutoCompleteOption } from '@/share/InterfaceTypes';
import { Box } from '@mui/material';
import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

interface VirtualizedListProps {
    options: AutoCompleteOption[];
    height: number;
    width: string;
    itemSize: number;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = ({
    options,
    height,
    width,
    itemSize,
}) => {


    const Row: React.FC<ListChildComponentProps> = ({ index, style }) => {
        const option = options[index];

        return (
            <div style={style}>
                {option && (
                    <Box component="li" key={`${option.value}-${index}`} sx={{ fontSize: 16 }}
                    >
                        {option.value ? option.value : '--'}
                    </Box>
                )}
            </div>
        );
    };

    return (
        <FixedSizeList
            height={height}
            width={width}
            itemSize={itemSize}
            itemCount={options.length}
        >
            {Row}
        </FixedSizeList>
    );
};

export default VirtualizedList;
