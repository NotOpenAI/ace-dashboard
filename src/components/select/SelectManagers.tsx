import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Manager } from '../../types/Role.tsx';
import MenuItem from '@mui/material/MenuItem';

type SelectProps = {
    label: string;
    options: Manager[];
    value: number[];
    onChange: Function;
    required?: boolean;
};

export const SelectManagers = ({
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
                    multiple
                    fullWidth
                    // @ts-ignore
                    value={value}
                    label={label}
                    onChange={handleChange}
                    required={required}
                >
                    {options &&
                        options.map((manager: Manager) => {
                            return (
                                // @ts-ignore
                                <MenuItem key={manager.id} value={manager.id}>
                                    {`${manager.first_name} ${manager.last_name}`}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        </>
    );
};
