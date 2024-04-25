import { setIsChangeAuto } from '@/redux/getAutoCompleteSlice';
import { AppDispatch } from '@/redux/store';
import { TextField, Typography } from '@mui/material';
import { ChangeEvent, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
interface FilterTextBoxProp {
    textValue: string
    setTextValue: React.Dispatch<React.SetStateAction<string>>
}
const FilterTextBox: FunctionComponent<FilterTextBoxProp> = ({ textValue, setTextValue }) => {
    const dispatch: AppDispatch = useDispatch();
    const handleTextInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setTextValue(newValue)
        dispatch(setIsChangeAuto(true));
    };

    return (
        <TextField
            variant="outlined"
            fullWidth
            value={textValue}
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
