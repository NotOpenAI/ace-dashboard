import {
    Alert,
    Breadcrumbs,
    Button,
    Link,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    NavLink as RouterLink,
    useNavigate,
    useParams,
} from 'react-router-dom';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import AttributeSelect from '../../components/attributeSelect.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Attribute, AttributeOption } from './NewBid.tsx';
import { BASE_URL, SPACING } from '../../constants.tsx';
import { DateTimePicker } from '@mui/x-date-pickers';
import Footer from '../../components/Footer.tsx';
import { useEffect, useState } from 'react';
import { Masonry } from '@mui/lab';
import * as dayjs from 'dayjs';
import axios from 'axios';

export interface Bid {
    name: string;
    id: number;
    bid_managers: Manager[];
    project_managers: Manager[];
    lead: string;
    foreman: string;
    customer: Customer;
    start_date: string;
    finish_date: string;
    original_contract: number;
    original_cost: number;
    attributes: Attribute[];
    created_at: string;
    updated_at: string;
}

export interface Manager {
    username: string;
    first_name: string;
    last_name: string;
    id: number;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    name: string;
    owner: string;
    market: string;
    reputation: number;
    fin_health: number;
    id: number;
    created_at: string;
    updated_at: string;
}

export const Bid = () => {
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

    const [bid, setBid] = useState<Bid>();
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (accessToken) {
            fetchBid();
        }
    }, [accessToken]);

    const fetchBid = () => {
        axios
            .get(`${BASE_URL}/bids/${id}`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setBid(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));

        axios
            .get(`${BASE_URL}/bids/attribute-types`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setAttributes(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching attribute types:', error);
            });
    };

    const handleSave = () => {
        if (accessToken && bid) {
            const payload = {
                name: bid.name,
                lead: bid.lead,
                bid_manager_ids: bid.bid_managers.map((manager) => manager.id),
                project_manager_ids: bid.project_managers.map(
                    (manager) => manager.id
                ),
                foreman: bid.foreman,
                start_date: bid.start_date,
                original_contract: 0, // Add your logic to calculate original contract value
                original_cost: 0, // Add your logic to calculate original cost value
                attributes: {
                    updated_attributes: bid.attributes.map((attribute) => ({
                        num_val: attribute.num_val,
                        type_id: attribute.type.id,
                        option_id: attribute.option ? attribute.option.id : 0,
                    })),
                    deleted_attributes: [], // Add logic to handle deleted attributes if needed
                },
            };

            axios
                .put(`${BASE_URL}/bids/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${encodeURIComponent(
                            accessToken
                        )}`,
                    },
                })
                .then((response) => {
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Bid updated successfully.');
                    setSnackbarOpen(true);
                    console.log('Bid updated successfully:', response.data);
                })
                .catch((error) => {
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Error updating bid.');
                    setSnackbarOpen(true);
                    console.error('Error updating bid:', error);
                });
        }
    };

    const handleInputChange = (field: string, value: any) => {
        if (bid) {
            setBid({ ...bid, [field]: value });
        }
    };

    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: SPACING }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Link href={'/bids'} color={'inherit'} underline={'hover'}>
                    Bids
                </Link>
                <Typography color={'text.primary'}>{id}</Typography>
            </Breadcrumbs>
            {!loading && (
                <>
                    <Masonry columns={2} spacing={SPACING}>
                        <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                            <Typography
                                variant={'h6'}
                                fontWeight={'light'}
                                paddingBottom={SPACING}
                            >
                                General Information
                            </Typography>
                            <Masonry columns={2} spacing={SPACING}>
                                <TextField
                                    variant={'outlined'}
                                    label={'ID'}
                                    value={bid?.id ?? ''}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Name'}
                                    value={bid?.name ?? ''}
                                    fullWidth
                                    onChange={(e) =>
                                        handleInputChange(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Lead'}
                                    value={bid?.lead ?? ''}
                                    fullWidth
                                    onChange={(e) =>
                                        handleInputChange(
                                            'lead',
                                            e.target.value
                                        )
                                    }
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Foreman'}
                                    value={bid?.foreman ?? ''}
                                    fullWidth
                                    onChange={(e) =>
                                        handleInputChange(
                                            'foreman',
                                            e.target.value
                                        )
                                    }
                                />
                                <DateTimePicker
                                    label={'Start Date'}
                                    value={
                                        bid?.start_date
                                            ? dayjs(bid?.start_date)
                                            : null
                                    }
                                    onChange={(date: dayjs.Dayjs | null) => {
                                        if (date) {
                                            handleInputChange(
                                                'start_date',
                                                date
                                            );
                                        }
                                    }}
                                />
                                <DateTimePicker
                                    label={'Finish Date'}
                                    value={
                                        bid?.finish_date
                                            ? dayjs(bid?.finish_date)
                                            : null
                                    }
                                    onChange={(date: dayjs.Dayjs | null) => {
                                        if (date) {
                                            handleInputChange(
                                                'finish_date',
                                                date
                                            );
                                        }
                                    }}
                                />
                            </Masonry>
                        </Paper>

                        <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                            <Typography
                                variant={'h6'}
                                fontWeight={'light'}
                                paddingBottom={SPACING}
                            >
                                Bid Managers
                            </Typography>
                            <Stack direction={'column'} spacing={1}>
                                {bid?.bid_managers.map(
                                    (bid_manager: Manager) => (
                                        <Paper
                                            key={bid_manager.id}
                                            sx={{ padding: 1 }}
                                        >
                                            <Masonry
                                                columns={2}
                                                spacing={SPACING}
                                            >
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'ID'}
                                                    defaultValue={
                                                        bid_manager.id
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'Username'}
                                                    defaultValue={
                                                        bid_manager.username
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'First Name'}
                                                    defaultValue={
                                                        bid_manager.first_name
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'Last Name'}
                                                    defaultValue={
                                                        bid_manager.last_name
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <DateTimePicker
                                                    label={'Created At'}
                                                    defaultValue={dayjs(
                                                        bid_manager.created_at
                                                    )}
                                                    disabled
                                                />
                                                <DateTimePicker
                                                    label={'Updated At'}
                                                    defaultValue={
                                                        bid_manager.updated_at
                                                            ? dayjs(
                                                                  bid_manager.updated_at
                                                              )
                                                            : undefined
                                                    }
                                                    disabled
                                                />
                                            </Masonry>
                                        </Paper>
                                    )
                                )}
                                <Button
                                    startIcon={<AddRoundedIcon />}
                                    sx={{ height: 56 }}
                                    fullWidth
                                >
                                    Add
                                </Button>
                            </Stack>
                        </Paper>

                        <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                            <Typography
                                variant={'h6'}
                                fontWeight={'light'}
                                paddingBottom={SPACING}
                            >
                                Customer
                            </Typography>
                            <Masonry columns={2} spacing={SPACING}>
                                <TextField
                                    variant={'outlined'}
                                    label={'ID'}
                                    defaultValue={bid?.customer.id}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Name'}
                                    defaultValue={bid?.customer.name}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Owner'}
                                    defaultValue={bid?.customer.owner}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Market'}
                                    defaultValue={bid?.customer.market}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Reputation'}
                                    defaultValue={bid?.customer.reputation}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Financial Health'}
                                    defaultValue={bid?.customer.fin_health}
                                    fullWidth
                                    disabled
                                />
                                <DateTimePicker
                                    label={'Created At'}
                                    defaultValue={dayjs(
                                        bid?.customer.created_at
                                    )}
                                    disabled
                                />
                                <DateTimePicker
                                    label={'Updated At'}
                                    defaultValue={
                                        bid?.customer.updated_at
                                            ? dayjs(bid?.customer.updated_at)
                                            : undefined
                                    }
                                    disabled
                                />
                            </Masonry>
                        </Paper>
                        {bid?.attributes && (
                            <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                                <Typography
                                    variant={'h6'}
                                    fontWeight={'light'}
                                    paddingBottom={SPACING}
                                >
                                    Attributes
                                </Typography>
                                <Masonry columns={2} spacing={SPACING}>
                                    {attributes.map((attribute: Attribute) => (
                                        <div key={attribute.id}>
                                            {attribute.options.length ? (
                                                <AttributeSelect
                                                    label={convertToSentenceCase(
                                                        attribute.name
                                                    )}
                                                    options={attribute.options}
                                                    required={
                                                        attribute.required
                                                    }
                                                    value={
                                                        bid?.attributes.find(
                                                            (attr) =>
                                                                attr.name ===
                                                                attribute.name
                                                        )?.options
                                                    }
                                                    onChange={(
                                                        selected: AttributeOption | null
                                                    ) => {
                                                        console.log(
                                                            bid?.attributes.find(
                                                                (attr) =>
                                                                    attr.name ===
                                                                    attribute.name
                                                            )?.options
                                                        );
                                                        const updatedAttributes =
                                                            bid?.attributes.map(
                                                                (
                                                                    attr: Attribute
                                                                ) => {
                                                                    if (
                                                                        attr.name ===
                                                                        attribute.name
                                                                    ) {
                                                                        return selected
                                                                            ? {
                                                                                  ...attr,
                                                                                  options:
                                                                                      selected,
                                                                              }
                                                                            : attr;
                                                                    }
                                                                    return attr;
                                                                }
                                                            );
                                                        if (
                                                            !bid?.attributes.find(
                                                                (attr) =>
                                                                    attr.name ===
                                                                    attribute.name
                                                            )
                                                        ) {
                                                            updatedAttributes.push(
                                                                {
                                                                    name: attribute.name,
                                                                    id: attribute.id,
                                                                    active: true,
                                                                    required:
                                                                        attribute.required,
                                                                    options:
                                                                        selected
                                                                            ? [
                                                                                  selected,
                                                                              ]
                                                                            : [],
                                                                }
                                                            );
                                                        }
                                                        setBid({
                                                            ...(bid as Bid),
                                                            attributes:
                                                                updatedAttributes as Attribute[],
                                                        });
                                                    }}
                                                />
                                            ) : (
                                                <TextField
                                                    fullWidth
                                                    label={convertToSentenceCase(
                                                        attribute.name
                                                    )}
                                                    variant={'outlined'}
                                                    type={'number'}
                                                    value={
                                                        bid?.attributes.find(
                                                            (attr) =>
                                                                attr.name ===
                                                                attribute.name
                                                        )?.num_val ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            'num_val',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </Masonry>
                            </Paper>
                        )}
                    </Masonry>
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-end'}
                        spacing={1}
                        paddingTop={4}
                    >
                        <Button
                            variant={'text'}
                            color={'inherit'}
                            component={RouterLink}
                            to={'/bids'}
                        >
                            Cancel
                        </Button>
                        <Button variant={'contained'} onClick={handleSave}>
                            Save
                        </Button>
                    </Stack>
                </>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Footer />
        </>
    );
};
