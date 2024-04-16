import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Status } from '../../types/Bid.tsx';

type SelectProps = {
    label: string;
    options: Status[];
    value?: number;
    onChange: Function;
    required?: boolean;
};

export const SelectStatus = ({
    label,
    options,
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
                        options.map((status: Status) => {
                            return (
                                // @ts-ignore
                                <MenuItem key={status.id} value={status.id}>
                                    {status.value}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        </>
    );
};
