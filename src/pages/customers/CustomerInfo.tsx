import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Divider,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Contact, Customer } from '../../types/Customer.tsx';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Footer from '../../components/Footer.tsx';
import { BASE_URL } from '../../constants.tsx';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import * as dayjs from 'dayjs';
import axios from 'axios';

export const CustomerInfo = () => {
    const { id } = useParams();

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

    const [customer, setCustomer] = useState<Customer>();
    const [originalCustomer, setOriginalCustomer] = useState<Customer>();
    const [loading, setLoading] = useState(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (accessToken) {
            fetchCustomer();
        }
    }, [accessToken]);

    const fetchCustomer = () => {
        axios
            .get(`${BASE_URL}/customers/${id}`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setCustomer(response.data.data);
                setOriginalCustomer(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const handleTextFieldChange = (key: string, value: string) => {
        setCustomer((prevUser: Customer | undefined) => {
            if (!prevUser) return prevUser;
            return {
                ...prevUser,
                [key]: value,
            };
        });
    };

    const handleAddContact = () => {
        setCustomer((prevCustomer) => {
            if (!prevCustomer) return prevCustomer;

            const newContact: Contact = {
                name: '',
                email: '',
                phone: '',
            };

            return {
                ...prevCustomer,
                contacts: [...prevCustomer.contacts, newContact],
            };
        });
    };

    const handleContactFieldChange = (
        contactIndex: number,
        key: string,
        value: string
    ) => {
        setCustomer((prevCustomer) => {
            if (!prevCustomer) return prevCustomer;

            const updatedContacts = [...prevCustomer.contacts];
            updatedContacts[contactIndex] = {
                ...updatedContacts[contactIndex],
                [key]: value,
            };

            return {
                ...prevCustomer,
                contacts: updatedContacts,
            };
        });
    };

    const handleDeleteContact = (contactIndex: number) => {
        setCustomer((prevCustomer) => {
            if (!prevCustomer) return prevCustomer;

            const updatedContacts = [...prevCustomer.contacts];
            updatedContacts.splice(contactIndex, 1);

            return {
                ...prevCustomer,
                contacts: updatedContacts,
            };
        });
    };

    const handleUpdate = () => {
        if (customer) {
            axios
                .put(`${BASE_URL}/customers/${id}`, customer, {
                    headers: {
                        Authorization: `Bearer ${encodeURIComponent(
                            accessToken
                        )}`,
                    },
                })
                .then((response) => {
                    setOriginalCustomer(response.data.data);
                    enqueueSnackbar('Updated customer', { variant: 'success' });
                })
                .catch((error) => {
                    if (typeof error.response.data.detail === 'object') {
                        error.response.data.detail.map(
                            (error: { msg: string }) =>
                                enqueueSnackbar(error.msg, { variant: 'error' })
                        );
                    } else {
                        enqueueSnackbar(error.response.data.detail, {
                            variant: 'error',
                        });
                    }
                    handleCancel();
                });
        }
    };

    const handleCancel = () => {
        setCustomer(originalCustomer);
    };

    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: 2 }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Link href={'/customers'} color={'inherit'} underline={'hover'}>
                    Customers
                </Link>
                <Typography color={'text.primary'}>{customer?.id}</Typography>
            </Breadcrumbs>
            {loading ? (
                <Box textAlign={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <Container maxWidth={'md'}>
                    <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                        <Typography variant={'h6'}>Customer</Typography>
                        <Stack
                            direction={'column'}
                            spacing={2}
                            divider={
                                <Divider orientation={'horizontal'} flexItem />
                            }
                            sx={{ paddingY: 2 }}
                        >
                            <Stack direction={'row'} spacing={1}>
                                <TextField
                                    variant={'outlined'}
                                    label={'ID'}
                                    defaultValue={customer?.id}
                                    disabled
                                />
                                <DateTimePicker
                                    label={'Created At'}
                                    defaultValue={dayjs(customer?.created_at)}
                                    sx={{ width: 500 }}
                                    readOnly
                                />
                                <DateTimePicker
                                    label={'Updated At'}
                                    defaultValue={dayjs(
                                        customer?.updated_at ||
                                            customer?.created_at
                                    )}
                                    sx={{ width: 500 }}
                                    readOnly
                                />
                            </Stack>
                            <TextField
                                variant={'outlined'}
                                label={'Name'}
                                value={customer?.name}
                                fullWidth
                                onChange={(e) =>
                                    handleTextFieldChange(
                                        'name',
                                        e.target.value
                                    )
                                }
                            />
                            <Stack direction={'row'} spacing={1}>
                                <TextField
                                    variant={'outlined'}
                                    label={'Owner'}
                                    value={customer?.owner || ''}
                                    fullWidth
                                    onChange={(e) =>
                                        handleTextFieldChange(
                                            'owner',
                                            e.target.value
                                        )
                                    }
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Financial Health'}
                                    value={customer?.fin_health || ''}
                                    fullWidth
                                    onChange={(e) =>
                                        handleTextFieldChange(
                                            'fin_health',
                                            e.target.value
                                        )
                                    }
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Market'}
                                    value={customer?.market || ''}
                                    fullWidth
                                    onChange={(e) =>
                                        handleTextFieldChange(
                                            'market',
                                            e.target.value
                                        )
                                    }
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Reputation'}
                                    value={customer?.reputation || ''}
                                    fullWidth
                                    onChange={(e) =>
                                        handleTextFieldChange(
                                            'reputation',
                                            e.target.value
                                        )
                                    }
                                />
                            </Stack>
                        </Stack>
                        <Typography variant={'subtitle1'}>Contacts</Typography>
                        <Stack
                            direction={'column'}
                            spacing={1}
                            sx={{ paddingY: 2 }}
                        >
                            {customer?.contacts.map(
                                (contact: Contact, index) => (
                                    <div key={index}>
                                        <Stack direction={'row'} spacing={1}>
                                            <TextField
                                                variant={'outlined'}
                                                label={'Name'}
                                                value={contact.name || ''}
                                                onChange={(e) =>
                                                    handleContactFieldChange(
                                                        index,
                                                        'name',
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                            <TextField
                                                variant={'outlined'}
                                                label={'Email'}
                                                value={contact.email || ''}
                                                onChange={(e) =>
                                                    handleContactFieldChange(
                                                        index,
                                                        'email',
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                            <TextField
                                                variant={'outlined'}
                                                label={'Phone'}
                                                value={contact.phone || ''}
                                                onChange={(e) =>
                                                    handleContactFieldChange(
                                                        index,
                                                        'phone',
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                            <Tooltip
                                                title={'Remove'}
                                                placement={'bottom'}
                                                arrow
                                            >
                                                <IconButton
                                                    color={'error'}
                                                    sx={{ borderRadius: 1 }}
                                                    onClick={() =>
                                                        handleDeleteContact(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </div>
                                )
                            )}
                            <Button
                                color={'primary'}
                                startIcon={<AddRoundedIcon />}
                                onClick={handleAddContact}
                                fullWidth
                            >
                                Add
                            </Button>
                        </Stack>
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-end'}
                            spacing={1}
                        >
                            <Button color={'inherit'} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                variant={'contained'}
                                onClick={handleUpdate}
                                disabled={customer === originalCustomer}
                            >
                                Save
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            )}
            <Footer />
        </>
    );
};
