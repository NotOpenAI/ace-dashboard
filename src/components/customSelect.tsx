import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type SelectProps = {
    label: string;
    options: string[];
};

const CustomSelect = ({ label, options }: SelectProps) => {
    const [value, setValue] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setValue(event.target.value as string);
    };

    return (
        <Box>
            <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select value={value} label={label} onChange={handleChange}>
                    {options.map((option: string) => {
                        return <MenuItem value={option}>{option}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CustomSelect;
