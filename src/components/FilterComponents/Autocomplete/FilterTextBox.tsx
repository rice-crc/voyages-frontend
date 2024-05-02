import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setTextFilter } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Filter, RangeSliderState } from '@/share/InterfaceTypes';
import { TextField, Typography } from '@mui/material';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
interface FilterTextProps {
    handleKeyDownTextFilter: (value: string) => void
}
const FilterTextBox: FunctionComponent<FilterTextProps> = ({ handleKeyDownTextFilter }) => {
    const dispatch: AppDispatch = useDispatch();
    const { textFilter } = useSelector((state: RootState) => state.getShowFilterObject);
    const { varName } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );

    const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        dispatch(setTextFilter(newValue))
        dispatch(setIsChangeAuto(true));

        if (newValue.length === 0) {
            dispatch(setTextFilter(''));
        }
    };

    return (
        <TextField
            variant="outlined"
            fullWidth
            value={textFilter}
            onChange={handleTextInputChange}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleKeyDownTextFilter(textFilter);
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

export default FilterTextBox;
