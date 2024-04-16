import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AttributeOption } from '../../types/Bid.tsx';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

type SelectProps = {
    label: string;
    options: AttributeOption[];
    value?: number;
    onChange?: Function;
    required?: boolean;
};

export const SelectAttribute = ({
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
                        options.map((attributeOption: AttributeOption) => {
                            return (
                                // @ts-ignore
                                <MenuItem
                                    key={attributeOption.id}
                                    value={attributeOption.id}
                                >
                                    {attributeOption.value}
                                </MenuItem>
                            );
                        })}
                </Select>
            </FormControl>
        </>
    );
};
