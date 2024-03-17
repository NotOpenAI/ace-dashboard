import { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import CustomButton from './customButton.tsx';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type Attribute = {
    num_val: number;
    id: number;
    type: {
        name: string;
        id: number;
    };
    option: string | null;
    created_at: string;
    updated_at: string | null;
};

type DeleteAttributeProps = {
    options: Attribute[];
    handleDeleteAttribute?: string;
};

const DeleteAttribute = ({ options }: DeleteAttributeProps) => {
    const [open, setOpen] = useState(false);

    const [attribute, setAttribute] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (e: { target: { value: any } }) => {
        setAttribute(e.target.value);
    };

    const handleSubmit = () => {
        setAttribute('');
        handleClose();
    };

    return (
        <>
            <CustomButton
                onClick={handleOpen}
                icon={<AddRoundedIcon />}
                color={'error'}
                label={'Delete Attribute'}
            />
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
