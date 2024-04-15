import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Divider,
    Link,
    Modal,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    Attribute,
    AttributeOption,
    Bid,
    Customer,
    Manager,
} from './NewBid.tsx';
import {
    BASE_URL,
    FIELD_COLUMNS,
    PAGE_COLUMNS,
    SPACING,
} from '../../constants.tsx';
import {
    NavLink as RouterLink,
    useNavigate,
    useParams,
} from 'react-router-dom';
import UpdateBidConfirmation from '../../components/updateBidConfirmation.tsx';
import updateBidConfirmation from '../../components/updateBidConfirmation.tsx';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import CreateAttribute from '../../components/createAttribute.tsx';
import AttributeSelect from '../../components/attributeSelect.tsx';
import CustomerSelect from '../../components/customerSelect.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ManagerSelect from '../../components/managerSelect.tsx';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DateTimePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Footer from '../../components/Footer.tsx';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { Masonry } from '@mui/lab';
import * as dayjs from 'dayjs';
import axios from 'axios';

export const BidV2 = () => {
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
    const [originalBid, setOriginalBid] = useState<Bid>();

    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [bidManagers, setBidManagers] = useState<Manager[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(true);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (accessToken) {
            fetchBid();
            fetchAttributeTypes();
            fetchBidManagers();
            fetchCustomers();
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
                setOriginalBid(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const fetchAttributeTypes = () => {
        axios
            .get(`${BASE_URL}/bids/attribute-types`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setAttributes(response.data.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const fetchBidManagers = () => {
        const params = {
            role_name: 'Bid Manager',
        };

        axios
            .get(`${BASE_URL}/users`, {
                params,
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setBidManagers(response.data.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const fetchCustomers = () => {
        axios
            .get(`${BASE_URL}/customers`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setCustomers(response.data.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const handleChange = (fieldName: keyof Bid, value: any) => {
        setBid({ ...bid, [fieldName]: value });
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
                finish_date: bid.finish_date,
                original_contract: 0, // Add your logic to calculate original contract value
                original_cost: 0, // Add your logic to calculate original cost value
                attributes: {
                    updated_attributes: bid.attributes.map((attribute) => ({
                        num_val: attribute.option,
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

    // @ts-ignore
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
            {loading ? (
                <Box textAlign={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <Masonry columns={PAGE_COLUMNS} spacing={SPACING}>
                    <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                        <Typography
                            variant={'h6'}
                            fontWeight={'light'}
                            paddingBottom={SPACING}
                        >
                            General Information
                        </Typography>
                        <Masonry columns={FIELD_COLUMNS} spacing={SPACING}>
                            <TextField
                                variant={'outlined'}
                                label={'Name'}
                                value={bid?.name}
                                onChange={(e) =>
                                    handleChange('name', e.target.value)
                                }
                                fullWidth
                                required
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Lead'}
                                value={bid.lead}
                                onChange={(e) =>
                                    handleChange('lead', e.target.value)
                                }
                                fullWidth
                                required
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Foreman'}
                                value={bid.foreman}
                                onChange={(e) =>
                                    handleChange('foreman', e.target.value)
                                }
                                fullWidth
                            />
                            <CustomerSelect
                                options={customers}
                                // @ts-ignore
                                value={bid.customer}
                                onChange={(customer: Customer) => {
                                    setBid({ ...bid, ['customer']: customer });
                                }}
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Original Contract'}
                                value={bid.original_contract}
                                onChange={(e) =>
                                    handleChange(
                                        'original_contract',
                                        e.target.value
                                    )
                                }
                                type={'number'}
                                fullWidth
                                required
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Original Cost'}
                                value={bid.original_cost}
                                onChange={(e) =>
                                    handleChange(
                                        'original_cost',
                                        e.target.value
                                    )
                                }
                                type={'number'}
                                fullWidth
                                required
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
                                        handleChange('start_date', date);
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
                                        handleChange('finish_date', date);
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
                        <Stack
                            direction={'column'}
                            spacing={1}
                            divider={<Divider />}
                        >
                            {bid?.bid_managers.map((bid_manager: Manager) => (
                                <Box key={bid_manager.id} sx={{ padding: 1 }}>
                                    <Stack direction={'row'} spacing={SPACING}>
                                        <Masonry
                                            columns={FIELD_COLUMNS}
                                            spacing={SPACING}
                                        >
                                            <TextField
                                                variant={'outlined'}
                                                label={'ID'}
                                                defaultValue={bid_manager.id}
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
                                        <Tooltip
                                            title={'Remove'}
                                            placement={'bottom'}
                                            arrow
                                        >
                                            <IconButton
                                                color={'error'}
                                                sx={{ borderRadius: 1 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            ))}
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
                            Project Managers
                        </Typography>
                        <Stack
                            direction={'column'}
                            spacing={1}
                            divider={<Divider />}
                        >
                            {bid?.project_managers.map(
                                (project_manager: Manager) => (
                                    <Box
                                        key={project_manager.id}
                                        sx={{ padding: 1 }}
                                    >
                                        <Stack
                                            direction={'row'}
                                            spacing={SPACING}
                                        >
                                            <Masonry
                                                columns={FIELD_COLUMNS}
                                                spacing={SPACING}
                                            >
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'ID'}
                                                    defaultValue={
                                                        project_manager.id
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'Username'}
                                                    defaultValue={
                                                        project_manager.username
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'First Name'}
                                                    defaultValue={
                                                        project_manager.first_name
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    variant={'outlined'}
                                                    label={'Last Name'}
                                                    defaultValue={
                                                        project_manager.last_name
                                                    }
                                                    fullWidth
                                                    disabled
                                                />
                                                <DateTimePicker
                                                    label={'Created At'}
                                                    defaultValue={dayjs(
                                                        project_manager.created_at
                                                    )}
                                                    disabled
                                                />
                                                <DateTimePicker
                                                    label={'Updated At'}
                                                    defaultValue={
                                                        project_manager.updated_at
                                                            ? dayjs(
                                                                  project_manager.updated_at
                                                              )
                                                            : undefined
                                                    }
                                                    disabled
                                                />
                                            </Masonry>
                                            <Tooltip
                                                title={'Remove'}
                                                placement={'bottom'}
                                                arrow
                                            >
                                                <IconButton
                                                    color={'error'}
                                                    sx={{ borderRadius: 1 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Box>
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
                        <Masonry columns={FIELD_COLUMNS} spacing={SPACING}>
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
                                defaultValue={dayjs(bid?.customer.created_at)}
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

                    <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                        <Typography
                            variant={'h6'}
                            fontWeight={'light'}
                            paddingBottom={SPACING}
                        >
                            Attributes
                        </Typography>
                        <Masonry columns={FIELD_COLUMNS} spacing={SPACING}>
                            {attributes.map((attribute) => (
                                <div key={attribute.id}>
                                    {attribute.options.length ? (
                                        <AttributeSelect
                                            label={convertToSentenceCase(
                                                attribute.name
                                            )}
                                            options={attribute.options.map(
                                                (option: AttributeOption) =>
                                                    option
                                            )}
                                            required={attribute.required}
                                            value={
                                                bid.attributes.find(
                                                    (attr: Attribute) =>
                                                        attr.type.name ===
                                                        attribute.name
                                                )?.option || ''
                                            }
                                            onChange={(
                                                selected: AttributeOption | null
                                            ) => {
                                                const updatedAttributes: Attribute[] =
                                                    bid.attributes.map(
                                                        (attr: Attribute) => {
                                                            if (
                                                                attr.type
                                                                    .name ===
                                                                attribute.name
                                                            ) {
                                                                return selected
                                                                    ? {
                                                                          ...attr,
                                                                          option: selected,
                                                                      }
                                                                    : attr;
                                                            }
                                                            return attr;
                                                        }
                                                    );
                                                if (
                                                    !bid.attributes.find(
                                                        (attr) =>
                                                            attr.type.name ===
                                                            attribute.name
                                                    )
                                                ) {
                                                    // If the attribute doesn't exist in bid.attributes, add it
                                                    updatedAttributes.push({
                                                        name: attribute.name,
                                                        id: attribute.id,
                                                        active: true,
                                                        required:
                                                            attribute.required,
                                                        option: selected,
                                                    });
                                                }
                                                setBid({
                                                    ...bid,
                                                    attributes:
                                                        updatedAttributes,
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
                                        />
                                    )}
                                </div>
                            ))}
                            <CreateAttribute />
                        </Masonry>
                    </Paper>
                </Masonry>
            )}
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
                <UpdateBidConfirmation
                    updatedBid={bid}
                    originalBid={originalBid}
                    onSave={handleSave}
                />
            </Stack>
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
