import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Button, Modal, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

type Attribute = {
    num_val: number;
    type: {
        name: string;
        id: number;
    };
    option: {
        value: string;
        id: number;
    } | null;
    created_at: string;
    updated_at: string;
};

type DeleteAttributeProps = {
    options: Attribute[];
    handleDeleteAttribute: (attributeType: string) => void;
};

const DeleteAttribute = ({
    options,
    handleDeleteAttribute,
}: DeleteAttributeProps) => {
    const [open, setOpen] = useState(false);
    const [attribute, setAttribute] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (event: SelectChangeEvent<string>) => {
        setAttribute(event.target.value);
    };

    const handleSubmit = () => {
        handleDeleteAttribute(attribute);
        setAttribute('');
        handleClose();
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                startIcon={<DeleteRoundedIcon />}
                color={'error'}
                sx={{ height: 56 }}
                fullWidth
            >
                Remove
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        width: 400,
                        p: 4,
                    }}
                >
                    <Typography
                        variant={'h6'}
                        fontWeight={'light'}
                        textAlign={'center'}
                        paddingBottom={2}
                    >
                        Remove Attribute
                    </Typography>
                    <FormControl fullWidth required sx={{ paddingY: 1 }}>
                        <InputLabel>Attribute</InputLabel>
                        <Select
                            value={attribute}
                            label={'Type'}
                            onChange={handleInputChange}
                        >
                            {options.map(({ type }) => (
                                <MenuItem key={type.id} value={type.name}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant={'contained'}
                        color={'error'}
                        onClick={handleSubmit}
                        sx={{ marginTop: 1 }}
                        fullWidth
                    >
                        Delete
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default DeleteAttribute;
