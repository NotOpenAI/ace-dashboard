import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AttributeOption } from '../pages/bids/NewBid.tsx';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

type SelectProps = {
    label: string;
    required: boolean;
    options: AttributeOption[];
    value: AttributeOption;
    onChange: (selected: string) => void;
};

const AttributeSelect = ({
    label,
    options,
    required,
    value,
    onChange,
}: SelectProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value);
    };

    return (
        <Box>
            <FormControl fullWidth required={required}>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={value || ''}
                    label={label}
                    // @ts-ignore
                    onChange={handleChange}
                    renderValue={(option: AttributeOption) => option.value}
                >
                    {options.map((option: AttributeOption) => {
                        return (
                            // @ts-ignore
                            <MenuItem key={option.id} value={option}>
                                {option.value}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
};

export default AttributeSelect;
