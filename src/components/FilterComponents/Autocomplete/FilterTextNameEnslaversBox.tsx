import { usePageRouter } from '@/hooks/usePageRouter';
import { setEnslaversName } from '@/redux/getRangeSliderSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { FilterObjectsState } from '@/share/InterfaceTypes';
import { TextField, Typography } from '@mui/material';
import { ChangeEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FilterTextNameEnslaversBox = () => {
    const dispatch: AppDispatch = useDispatch();
    const { enslaverName } = useSelector((state: RootState) => state.rangeSlider as FilterObjectsState);

    const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        dispatch(setEnslaversName(newValue))
        if (newValue.length === 0) {
            dispatch(setEnslaversName(''));
        }
    }

    const handleKeyDownTextFilter = (value: string) => {
        dispatch(setEnslaversName(value));
    }

    return (
        <TextField
            variant="outlined"
            fullWidth
            value={enslaverName}
            onChange={handleTextInputChange}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleKeyDownTextFilter(enslaverName);
                }
            }}
            label={
                <Typography variant="body1" style={{ fontSize: 14 }} height={50}>
                    field
                </Typography>
            }
            placeholder="filter text"
            style={{ marginTop: 20, width: 450 }}
        />

    )
}

export default FilterTextNameEnslaversBox;
