import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    InputAdornment,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    Attribute,
    AttributeOption,
    Bid,
    bidStatusOptions,
    Status,
} from '../../types/Bid.tsx';
import {
    BASE_URL,
    FIELD_COLUMNS,
    PAGE_COLUMNS,
    SPACING,
} from '../../constants.tsx';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import { SelectStatus } from '../../components/select/SelectStatus.tsx';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import CreateAttribute from '../../components/createAttribute.tsx';
import AttributeSelect from '../../components/attributeSelect.tsx';
import CustomerSelect from '../../components/customerSelect.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ManagerSelect from '../../components/managerSelect.tsx';
import { SetStateAction, useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Customer } from '../../types/Customer.tsx';
import Footer from '../../components/Footer.tsx';
import { Manager } from '../../types/Role.tsx';
import { enqueueSnackbar } from 'notistack';
import { Masonry } from '@mui/lab';
import dayjs from 'dayjs';
import axios from 'axios';

export const NewBid = () => {
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

    const [bid, setBid] = useState<Bid>({
        name: '',
        bid_status: {
            id: 1,
            value: 'New',
        },
        bid_managers: [],
        project_managers: [],
        lead: '',
        foreman: '',
        // @ts-ignore
        customer: '',
        start_date: '',
        finish_date: '',
        original_contract: 0,
        final_cost: 0,
        attributes: [],
        created_at: '',
        updated_at: '',
    });

    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [bidManagers, setBidManagers] = useState<Manager[]>([]);
    const [projectManagers, setProjectManagers] = useState<Manager[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (accessToken) {
            fetchAttributeTypes();
            fetchBidManagers();
            fetchCustomers();
            fetchProjectManagers();
        }
    }, [accessToken]);

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

    const fetchProjectManagers = () => {
        const params = {
            role_name: 'Project Manager',
        };

        axios
            .get(`${BASE_URL}/users`, {
                params,
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setProjectManagers(response.data.data))
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

    const handleBidStatusSelectChange = (event: {
        target: { value: SetStateAction<number | undefined> };
    }) => {
        const selectedBidStatusID = event.target.value;
        if (typeof selectedBidStatusID === 'number') {
            const selectedStatus: Status | undefined = bidStatusOptions.find(
                (status) => status.id === selectedBidStatusID
            );
            if (selectedStatus) {
                // @ts-ignore
                setBid({ ...bid, bid_status: selectedStatus });
            }
        }
    };

    const [allRequiredFieldsFilled, setAllRequiredFieldsFilled] =
        useState(false);

    useEffect(() => {
        // Check if all required fields are filled
        const requiredFieldsFilled =
            bid.name !== '' &&
            bid.lead !== '' &&
            bid.original_contract !== 0 &&
            bid.final_cost !== 0;

        // Check if all attributes marked as required have values
        const allAttributesFilled = attributes.every(
            (attribute) =>
                !attribute.required ||
                (attribute.type.name === 'text'
                    ? attribute.num_val !== ''
                    : attribute.option !== undefined)
        );

        // Set the state to true if both required fields and attributes are filled
        setAllRequiredFieldsFilled(requiredFieldsFilled && allAttributesFilled);
    }, [bid, attributes]);

    const handleCreateBid = () => {
        const {
            name,
            bid_status,
            bid_managers,
            project_managers,
            customer,
            original_contract,
            final_cost,
            lead,
            foreman,
            start_date,
            finish_date,
            attributes,
        } = bid;

        const requestBody = {
            name,
            bid_status_id: bid_status.id,
            bid_manager_ids: bid_managers.map((manager) => manager.id),
            project_manager_ids: project_managers.map((manager) => manager.id),
            customer_id: customer.id,
            original_contract,
            final_cost,
            lead,
            foreman,
            start_date,
            finish_date,
            attributes: attributes.map((attribute) => ({
                type_id: attribute.id,
                option_id: attribute.option.id,
            })),
        };

        axios
            .post(`${BASE_URL}/bids`, requestBody, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then(() => {
                // Handle success, e.g., show success message or redirect
                enqueueSnackbar('Bid created', { variant: 'success' });
                navigate('/bids'); // Redirect to bids page after creating bid
            })
            .catch((error) => {
                // Handle error
                if (typeof error.response.data.detail === 'object') {
                    error.response.data.detail.map((error: { msg: string }) =>
                        enqueueSnackbar(error.msg, { variant: 'error' })
                    );
                } else {
                    enqueueSnackbar(error.response.data.detail, {
                        variant: 'error',
                    });
                }
                console.error('Error creating bid:', error);
            });
    };

    // @ts-ignore
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
                <Typography color={'text.primary'}>New</Typography>
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
                                value={bid.name}
                                onChange={(e) =>
                                    handleChange('name', e.target.value)
                                }
                                fullWidth
                                required
                            />
                            <SelectStatus
                                label={'Bid Status'}
                                options={bidStatusOptions}
                                value={bid?.bid_status.id}
                                onChange={handleBidStatusSelectChange}
                            />
                            <ManagerSelect
                                label={'Bid Managers'}
                                options={bidManagers}
                                value={bid.bid_managers}
                                onChange={(managers: Manager[]) => {
                                    setBid({
                                        ...bid,
                                        ['bid_managers']: managers,
                                    });
                                }}
                            />
                            <ManagerSelect
                                label={'Project Managers'}
                                options={projectManagers}
                                value={bid.project_managers}
                                onChange={(managers: Manager[]) => {
                                    setBid({
                                        ...bid,
                                        ['project_managers']: managers,
                                    });
                                }}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                type={'number'}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Final Cost'}
                                value={bid.final_cost}
                                onChange={(e) =>
                                    handleChange('final_cost', e.target.value)
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                type={'number'}
                                fullWidth
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
                                            options={attribute.options}
                                            required={attribute.required}
                                            // @ts-ignore
                                            value={
                                                bid.attributes.find(
                                                    (attr) =>
                                                        attr.name ===
                                                        attribute.name
                                                )?.option || null
                                            }
                                            // @ts-ignore
                                            onChange={(
                                                selected: AttributeOption | null
                                            ) => {
                                                const updatedAttributes =
                                                    bid.attributes.map(
                                                        // @ts-ignore
                                                        (attr: Attribute) => {
                                                            if (
                                                                attr.name ===
                                                                attribute.name
                                                            ) {
                                                                return {
                                                                    ...attr,
                                                                    option: selected,
                                                                };
                                                            }
                                                            return attr;
                                                        }
                                                    );
                                                if (
                                                    !bid.attributes.find(
                                                        (attr) =>
                                                            attr.name ===
                                                            attribute.name
                                                    )
                                                ) {
                                                    // If the attribute doesn't exist in bid.attributes, add it
                                                    updatedAttributes.push({
                                                        ...attribute,
                                                        option: selected,
                                                    });
                                                }
                                                setBid({
                                                    ...bid,
                                                    // @ts-ignore
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
                                            value={attribute.num_val}
                                            onChange={(e) => {
                                                const updatedAttributes =
                                                    bid.attributes.map(
                                                        (attr: Attribute) => {
                                                            if (
                                                                attr.name ===
                                                                attribute.name
                                                            ) {
                                                                return {
                                                                    ...attr,
                                                                    num_val:
                                                                        e.target
                                                                            .value,
                                                                };
                                                            }
                                                            return attr;
                                                        }
                                                    );
                                                setBid({
                                                    ...bid,
                                                    attributes:
                                                        updatedAttributes,
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                            <CreateAttribute />
                            {/*<DeleteAttribute options={bid?.attributes} />*/}
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
                <Button
                    variant={'contained'}
                    onClick={handleCreateBid}
                    disabled={!allRequiredFieldsFilled}
                >
                    Create
                </Button>
            </Stack>
            <Footer />
        </>
    );
};

export default NewBid;
