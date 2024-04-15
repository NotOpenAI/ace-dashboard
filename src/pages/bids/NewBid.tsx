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
    BASE_URL,
    FIELD_COLUMNS,
    PAGE_COLUMNS,
    SPACING,
} from '../../constants.tsx';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import CreateAttribute from '../../components/createAttribute.tsx';
import AttributeSelect from '../../components/attributeSelect.tsx';
import CustomerSelect from '../../components/customerSelect.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ManagerSelect from '../../components/managerSelect.tsx';
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

export interface Attribute {
    name: string;
    id: number;
    active: boolean;
    required: boolean;
    options: AttributeOption[];
    num_val: string;
    type: AttributeType;
    option: AttributeOption;
}

export interface AttributeOption {
    value: string;
    id: number;
    active: boolean;
}

export interface AttributeType {
    id: number;
    name: string;
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

export interface Manager {
    username: string;
    first_name: string;
    last_name: string;
    id: number;
    created_at: string;
    updated_at: string;
}

export const NewBid = () => {
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

    const [bid, setBid] = useState<Bid>({
        id: 0,
        name: '',
        bid_managers: [],
        project_managers: [],
        lead: '',
        foreman: '',
        // @ts-ignore
        customer: '',
        start_date: '',
        finish_date: '',
        original_contract: 0,
        original_cost: 0,
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

    const [allRequiredFieldsFilled, setAllRequiredFieldsFilled] =
        useState(false);

    useEffect(() => {
        // Check if all required fields are filled
        const requiredFieldsFilled =
            bid.name !== '' &&
            bid.lead !== '' &&
            bid.original_contract !== 0 &&
            bid.original_cost !== 0;

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
            bid_managers,
            project_managers,
            customer,
            original_contract,
            original_cost,
            lead,
            foreman,
            start_date,
            finish_date,
            attributes,
        } = bid;

        const requestBody = {
            name,
            bid_manager_ids: bid_managers.map((manager) => manager.id),
            project_manager_ids: project_managers.map((manager) => manager.id),
            customer_id: customer.id,
            original_contract,
            original_cost,
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
            .then((response) => {
                // Handle success, e.g., show success message or redirect
                console.log('Bid created successfully:', response.data);
                navigate('/bids'); // Redirect to bids page after creating bid
            })
            .catch((error) => {
                // Handle error
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
                                label={'Original Cost'}
                                value={bid.original_cost}
                                onChange={(e) =>
                                    handleChange(
                                        'original_cost',
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
                                            onChange={(
                                                selected: AttributeOption | null
                                            ) => {
                                                const updatedAttributes =
                                                    bid.attributes.map(
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
