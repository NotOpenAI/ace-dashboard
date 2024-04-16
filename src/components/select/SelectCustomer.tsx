import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { Customer } from '../../types/Customer.tsx';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

type SelectProps = {
    options: Customer[];
    value?: number;
    onChange: Function;
    required?: boolean;
};

export const SelectCustomer = ({
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
                <InputLabel>Customer</InputLabel>
                <Select
                    fullWidth
                    // @ts-ignore
                    value={value}
                    label={'Customer'}
                    onChange={handleChange}
                    required={required}
                >
                    {options &&
                        options.map((customer: Customer) => {
                            return (
                                // @ts-ignore
                                <MenuItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        </>
    );
};
