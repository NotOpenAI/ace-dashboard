import { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CustomButton from './customButton.tsx';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type NewAttributeProps = {
    handleAddAttribute?: string;
};

const CreateAttribute = ({}: NewAttributeProps) => {
    const [open, setOpen] = useState(false);

    const [newAttributeData, setNewAttributeData] = useState({
        name: '',
        inputType: '',
        options: [],
        value: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewAttributeData({
            name: '',
            inputType: '',
            options: [],
            value: '',
        });
    };
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setNewAttributeData({
            ...newAttributeData,
            [name ?? 'inputType']: value,
        });
    };

    const handleSubmit = () => {
        setNewAttributeData({
            name: '',
            inputType: '',
            options: [],
            value: '',
        });
        handleClose();
    };

    return (
        <>
            <CustomButton
                onClick={handleOpen}
                icon={<AddRoundedIcon />}
                color={'success'}
                label={'Create Attribute'}
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
                        New Attribute
                    </Typography>
                    <Stack direction={'column'} spacing={1} paddingY={1}>
                        <TextField
                            name={'name'}
                            label={'Name'}
                            value={newAttributeData.name}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        {newAttributeData.inputType === 'text' ||
                            (newAttributeData.inputType === 'number' && (
                                <TextField
                                    name={'value'}
                                    label={'Value'}
                                    value={newAttributeData.value || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            ))}
                        {newAttributeData.inputType === 'select' && (
                            <FormControl fullWidth required>
                                <InputLabel>Options</InputLabel>
                                <Select
                                    value={newAttributeData.options}
                                    label={'Type'}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value={'text'}>Text</MenuItem>
                                    <MenuItem value={'number'}>Number</MenuItem>
                                    <MenuItem value={'select'}>Select</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Stack>
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-end'}
                        spacing={1}
                    >
                        <Button
                            variant={'text'}
                            color={'inherit'}
                            sx={{ marginTop: 1 }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={'contained'}
                            onClick={handleSubmit}
                            sx={{ marginTop: 1 }}
                        >
                            Create
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default CreateAttribute;
