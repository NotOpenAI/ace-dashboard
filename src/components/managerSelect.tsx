import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Manager } from '../pages/bids/Bid.tsx';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

type SelectProps = {
    label: string;
    options: Manager[];
    value: Manager[];
    onChange: Function;
};

const ManagerSelect = ({ label, options, value, onChange }: SelectProps) => {
    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as string);
    };

    return (
        <Box>
            <FormControl fullWidth required>
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    // @ts-ignore
                    value={value}
                    label={label}
                    onChange={handleChange}
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                            {/*@ts-ignore*/}
                            {selected.map((manager: Manager) => (
                                <Chip
                                    key={manager.id}
                                    label={`${manager.first_name} ${manager.last_name}`}
                                    size={'small'}
                                />
                            ))}
                        </Box>
                    )}
                >
                    {options.map((manager: Manager) => {
                        return (
                            // @ts-ignore
                            <MenuItem key={manager.id} value={manager}>
                                {`${manager.first_name} ${manager.last_name}`}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </Box>
    );
};

export default ManagerSelect;
