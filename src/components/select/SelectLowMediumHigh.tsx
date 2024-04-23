import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

type SelectProps = {
    label: string;
    value?: string | '';
    onChange: Function;
    required?: boolean;
};

const options = [
    {
        label: 'Low',
        value: '1',
    },
    {
        label: 'Medium',
        value: '2',
    },
    {
        label: 'High',
        value: '3',
    },
];

export const SelectLowMediumHigh = ({
    label,
    value,
    onChange,
    required = false,
}: SelectProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event);
    };

    return (
        <>
            <FormControl fullWidth required={required}>
                <InputLabel>{label}</InputLabel>
                <Select
                    fullWidth
                    // @ts-ignore
                    value={value}
                    label={label}
                    onChange={handleChange}
                    required={required}
                >
                    {options &&
                        options.map((option) => {
                            return (
                                // @ts-ignore
                                <MenuItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        </>
    );
};
