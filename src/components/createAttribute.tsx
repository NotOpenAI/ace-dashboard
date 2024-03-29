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
    handleAddAttribute: Function;
};

const CreateAttribute = ({ handleAddAttribute }: NewAttributeProps) => {
    const [open, setOpen] = useState(false);

    const [newAttributeData, setNewAttributeData] = useState({
        name: '',
        inputType: '',
        options: [],
        value: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setNewAttributeData({
            ...newAttributeData,
            [name ?? 'inputType']: value,
        });
    };

    const handleSubmit = () => {
        handleAddAttribute(newAttributeData);
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
                        <FormControl fullWidth required>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={newAttributeData.inputType}
                                label={'Type'}
                                onChange={handleInputChange}
                            >
                                <MenuItem value={'text'}>Text</MenuItem>
                                <MenuItem value={'select'}>Select</MenuItem>
                            </Select>
                        </FormControl>
                        {newAttributeData.inputType === 'text' && (
                            <TextField
                                name={'value'}
                                label={'Value'}
                                value={newAttributeData.value || ''}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        )}
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
                    <Button
                        variant={'contained'}
                        onClick={handleSubmit}
                        sx={{ marginTop: 1 }}
                        fullWidth
                    >
                        Create
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default CreateAttribute;
