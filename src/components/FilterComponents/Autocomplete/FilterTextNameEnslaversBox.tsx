import { setEnslaversName } from '@/redux/getRangeSliderSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { FilterObjectsState } from '@/share/InterfaceTypes';
import { TextField, Typography } from '@mui/material';
import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
interface FilterTextNameEnslaversProps {
    textError: string;
    setTextError: React.Dispatch<React.SetStateAction<string>>;

}
const FilterTextNameEnslaversBox: FunctionComponent<FilterTextNameEnslaversProps> = ({ textError, setTextError }) => {
    const dispatch: AppDispatch = useDispatch();
    const { enslaverName } = useSelector((state: RootState) => state.rangeSlider as FilterObjectsState);
    const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        dispatch(setEnslaversName(newValue))
        if (newValue.length === 0) {
            setTextError('Required could be more concise');
            dispatch(setEnslaversName(''));
        } else {
            setTextError('');
        }
    }

    const handleKeyDownTextFilter = (value: string) => {
        if (value.length === 0) {
            setTextError('Required could be more concise');
        } else {
            dispatch(setEnslaversName(value));
            setTextError('');
        }
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
                    Name
                </Typography>
            }
            placeholder="Last Name, First Name"
            style={{ marginTop: 20, width: 450 }}
            helperText={textError}
            FormHelperTextProps={{
                style: {
                    color: 'red',
                    fontSize: '0.875rem',
                },
            }}
        />
    )
}

export default FilterTextNameEnslaversBox;
