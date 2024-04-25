import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { setTextFilter } from '@/redux/getShowFilterObjectSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { TextField, Typography } from '@mui/material';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FilterTextBox = () => {
    const dispatch: AppDispatch = useDispatch();
    const { textFilter } = useSelector((state: RootState) => state.getShowFilterObject);

    const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        dispatch(setTextFilter(newValue))
        dispatch(setIsChangeAuto(true));
    };

    return (
        <TextField
            variant="outlined"
            fullWidth
            value={textFilter}
            onChange={handleTextInputChange}
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
