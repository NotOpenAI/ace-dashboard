import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Role } from '../../types/Role.tsx';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

type SelectProps = {
    options?: Role[];
    value?: number[];
    onChange: Function;
    required?: boolean;
};

export const SelectRoles = ({
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
                <InputLabel>Roles</InputLabel>
                <Select
                    multiple
                    fullWidth
                    // @ts-ignore
                    value={value}
                    label={'SelectRoles'}
                    onChange={handleChange}
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                            {/*@ts-ignore*/}
                            {selected.map((id: number) => (
                                <Chip
                                    key={id}
                                    label={
                                        options &&
                                        options.find(
                                            (option) => option.id === id
                                        )
                                            ? options.find(
                                                  (option) => option.id === id
                                              )?.name
                                            : 'Name not found'
                                    }
                                    size={'small'}
                                />
                            ))}
                        </Box>
                    )}
                    required={required}
                >
                    {options &&
                        options.map((role: Role) => {
                            return (
                                // @ts-ignore
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        </>
    );
};
