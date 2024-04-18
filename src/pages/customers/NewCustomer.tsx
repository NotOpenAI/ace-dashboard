import {
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
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Footer from '../../components/Footer.tsx';
import { BASE_URL } from '../../constants.tsx';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';

export const NewCustomer = () => {
    const [accessToken, setAccessToken] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const sessionExpiration = localStorage.getItem('sessionExpiration');

        if (sessionExpiration) {
            if (parseInt(sessionExpiration) - new Date().getTime() < 0) {
                navigate('/login');
            }
        }

        if (token) {
            setAccessToken(token);
        } else {
            navigate('/login');
        }
    }, []);

    const [customer, setCustomer] = useState<Customer>({
        name: '',
        owner: '',
        fin_health: '',
        market: '',
        reputation: '',
        contacts: [],
    });
    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    const handleTextFieldChange = (key: string, value: string) => {
        setCustomer((prevCustomer: Customer) => ({
            ...prevCustomer,
            [key]: value,
        }));
    };

    const handleAddContact = () => {
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            contacts: [
                // @ts-ignore
                ...prevCustomer.contacts,
                { name: '', email: '', phone: '' },
            ],
        }));
    };

    const handleContactFieldChange = (
        contactIndex: number,
        key: string,
        value: string
    ) => {
        setCustomer((prevCustomer) => {
            const updatedContacts = [...prevCustomer.contacts];
            updatedContacts[contactIndex] = {
                ...updatedContacts[contactIndex],
                [key]: value,
            };
            return { ...prevCustomer, contacts: updatedContacts };
        });
    };

    const handleDeleteContact = (contactIndex: number) => {
        setCustomer((prevCustomer) => {
            const updatedContacts = [...prevCustomer.contacts];
            updatedContacts.splice(contactIndex, 1);
            return { ...prevCustomer, contacts: updatedContacts };
        });
    };

    const handleSave = () => {
        setLoading(true);
        axios
            .post(`${BASE_URL}/customers`, customer, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setLoading(false);
                enqueueSnackbar('Customer created successfully', {
                    variant: 'success',
                });
                navigate(`/customers/${response.data.data.id}`);
            })
            .catch((error) => {
                setLoading(false);
                if (typeof error.response.data.detail === 'object') {
                    error.response.data.detail.map((error: { msg: string }) =>
                        enqueueSnackbar(error.msg, { variant: 'error' })
                    );
                } else {
                    enqueueSnackbar(error.response.data.detail, {
                        variant: 'error',
                    });
                }
            });
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
                <Typography color={'text.primary'}>New Customer</Typography>
            </Breadcrumbs>
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
                        <TextField
                            variant={'outlined'}
                            label={'Name'}
                            value={customer?.name}
                            fullWidth
                            onChange={(e) =>
                                handleTextFieldChange('name', e.target.value)
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
                        {customer.contacts &&
                            customer?.contacts.map(
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
                        <Button color={'inherit'}>Cancel</Button>
                        <Button
                            variant={'contained'}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Save'}
                        </Button>
                    </Stack>
                </Paper>
            </Container>
            <Footer />
        </>
    );
};
