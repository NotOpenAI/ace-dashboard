import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Customer } from '../types/Customer.tsx';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

type SelectProps = {
    options: Customer[];
    value: Customer;
    onChange: Function;
};

const CustomerSelect = ({ options, value, onChange }: SelectProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as string);
    };

    return (
        <Box>
            <FormControl fullWidth required>
                <InputLabel>Customer</InputLabel>
                <Select
                    value={value}
                    label={'Customer'}
                    // @ts-ignore
                    onChange={handleChange}
                    renderValue={(customer: Customer) => customer.name}
                >
                    {options.map((customer: Customer) => {
                        return (
                            // @ts-ignore
                            <MenuItem key={customer.id} value={customer}>
                                {customer.name}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CustomerSelect;
