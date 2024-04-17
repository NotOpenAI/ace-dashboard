import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Modal,
    TextField,
    Typography,
    Stack,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants.tsx';
import { useSnackbar } from 'notistack';
import axios from 'axios';

type NewAttributeProps = {
    handleAddAttribute?: () => void;
};

const CreateAttribute = ({ handleAddAttribute }: NewAttributeProps) => {
    const [accessToken, setAccessToken] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            navigate('/login');
        }
    }, []);

    const [open, setOpen] = useState(false);

    const [newAttributeData, setNewAttributeData] = useState({
        name: '',
        options: [],
        required: false,
    });

    const { enqueueSnackbar } = useSnackbar();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewAttributeData({
            name: '',
            options: [],
            required: false,
        });
    };

    const handleInputChange = (
        e: ChangeEvent<
            | HTMLInputElement
            | HTMLTextAreaElement
            | {
                  name?: string;
                  value: unknown;
              }
        >
    ) => {
        const { name, value } = e.target;
        setNewAttributeData({
            ...newAttributeData,
            [name ?? 'inputType']: value,
        });
    };

    const handleSubmit = async () => {
        // Validate if all required fields are filled
        if (newAttributeData.name && newAttributeData.options.length > 0) {
            // Call the API to create a new attribute type using Axios
            axios
                .post(
                    `${BASE_URL}/bids/attribute-types`,
                    {
                        name: newAttributeData.name,
                        options: newAttributeData.options.map(
                            (option, index) => {
                                return {
                                    id: index,
                                    value: option,
                                    active: false,
                                };
                            }
                        ),
                        required: newAttributeData.required,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${encodeURIComponent(
                                accessToken
                            )}`,
                        },
                    }
                )
                .then(() => {
                    // Call the callback function to handle adding the attribute
                    handleAddAttribute?.();
                    handleClose();
                })
                .catch((error) => {
                    enqueueSnackbar(error.response.data.detail, {
                        variant: 'error',
                    });
                });
        } else {
            // Display error message or handle incomplete form submission
            enqueueSnackbar('Please fill out all required fields', {
                variant: 'error',
            });
        }
    };

    // @ts-ignore
    return (
        <>
            <Button
                onClick={handleOpen}
                startIcon={<AddRoundedIcon />}
                sx={{ height: 56 }}
                fullWidth
            >
                Add
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
                        <TextField
                            name={'options'}
                            label={'Options (comma-separated)'}
                            value={newAttributeData.options.join(', ')}
                            onChange={(e) =>
                                setNewAttributeData({
                                    ...newAttributeData,
                                    // @ts-ignore
                                    options: e.target.value
                                        .split(',')
                                        .map((option) => option.trim()),
                                })
                            }
                            required
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={newAttributeData.required}
                                    onChange={(e) =>
                                        setNewAttributeData({
                                            ...newAttributeData,
                                            required: e.target.checked,
                                        })
                                    }
                                    color={'primary'}
                                />
                            }
                            label={'Required'}
                        />
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
