import convertToSentenceCase from '../utils/convertToSentenceCase.tsx';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Theme, useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import * as React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const roles = ['bid_manager', 'admin', 'other'];

const getColor = (value: string): string => {
    const colorMap: { [key: string]: string } = {
        admin: 'info',
        bid_manager: 'success',
        // Add more value-color mappings as needed
    };

    return colorMap[value] || 'default';
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const RoleSelect = () => {
    const theme = useTheme();
    const [roleName, setRoleName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof roleName>) => {
        const {
            target: { value },
        } = event;
        setRoleName(typeof value === 'string' ? value.split(',') : value);
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <div>
            <FormControl required fullWidth>
                <InputLabel>Roles</InputLabel>
                <Select
                    multiple
                    value={roleName}
                    onChange={handleChange}
                    input={<OutlinedInput label={'Chip'} />}
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                            {selected.map((value) => (
                                <Chip
                                    // @ts-ignore
                                    color={getColor(value)}
                                    size={'small'}
                                    key={value}
                                    label={convertToSentenceCase(value)}
                                />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {roles.map((role) => (
                        <MenuItem
                            key={role}
                            value={role}
                            style={getStyles(role, roleName, theme)}
                        >
                            {convertToSentenceCase(role)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default RoleSelect;
