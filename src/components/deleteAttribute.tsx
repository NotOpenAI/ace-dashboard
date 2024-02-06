import { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import CustomButton from './customButton.tsx';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type Attribute = {
    name: string;
    inputType: string;
    value: string;
    options: string[];
};

type DeleteAttributeProps = {
    options: Attribute[];
    handleDeleteAttribute: Function;
};

const DeleteAttribute = ({
    options,
    handleDeleteAttribute,
}: DeleteAttributeProps) => {
    const [open, setOpen] = useState(false);

    const [attribute, setAttribute] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (e: { target: { value: any } }) => {
        setAttribute(e.target.value);
    };

    const handleSubmit = () => {
        handleDeleteAttribute(attribute);
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
                            {options.map(({ name }) => (
                                <MenuItem key={name} value={name}>
                                    {name}
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
