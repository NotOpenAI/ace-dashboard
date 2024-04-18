import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Divider,
    InputAdornment,
    Link,
    MenuItem,
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
    jobStatusOptions,
    Status,
} from '../../types/Bid.tsx';
import { SelectCustomer } from '../../components/select/SelectCustomer.tsx';
import { SelectManagers } from '../../components/select/SelectManagers.tsx';
import { getCreateRequestBody } from '../../utils/getCreateRequestBody.tsx';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import { SelectStatus } from '../../components/select/SelectStatus.tsx';
import { BASE_URL, FIELD_COLUMNS, SPACING } from '../../constants.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SetStateAction, useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers';
import FormControl from '@mui/material/FormControl';
import { Customer } from '../../types/Customer.tsx';
import InputLabel from '@mui/material/InputLabel';
import Footer from '../../components/Footer.tsx';
import { Manager } from '../../types/Role.tsx';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
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
        bid_managers: [],
        project_managers: [],
        lead: '',
        foreman: '',
        start_date: '',
        finish_date: '',
        original_contract: 0,
        final_cost: 0,
        desired_margin: 0,
        actual_margin: 0,
        attributes: [],
        comments: [],
        created_at: '',
        updated_at: '',
    });

    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [bidManagers, setBidManagers] = useState<Manager[]>([]);
    const [projectManagers, setProjectManagers] = useState<Manager[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (accessToken) {
            fetchAllData();
        }
    }, [accessToken]);

    const fetchAllData = async () => {
        try {
            await Promise.all([
                fetchAttributeTypes(),
                fetchBidManagers(),
                fetchProjectManagers(),
                fetchCustomers(),
            ]);
        } catch (error) {
            // @ts-ignore
            enqueueSnackbar(error.response.data.detail, { variant: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttributeTypes = async () => {
        const response = await axios.get(`${BASE_URL}/bids/attribute-types`, {
            headers: {
                Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
            },
        });
        setAttributes(response.data.data);
    };

    const fetchBidManagers = async () => {
        const params = { role_name: 'Bid Manager' };
        const response = await axios.get(`${BASE_URL}/users`, {
            params,
            headers: {
                Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
            },
        });
        setBidManagers(response.data.data);
    };

    const fetchProjectManagers = async () => {
        const params = { role_name: 'Project Manager' };
        const response = await axios.get(`${BASE_URL}/users`, {
            params,
            headers: {
                Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
            },
        });
        setProjectManagers(response.data.data);
    };

    const fetchCustomers = async () => {
        const response = await axios.get(`${BASE_URL}/customers`, {
            headers: {
                Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
            },
        });
        setCustomers(response.data.data);
    };

    const [allRequiredFieldsFilled, setAllRequiredFieldsFilled] =
        useState(false);

    useEffect(() => {
        // Check if all required fields are filled
        const requiredFieldsFilled =
            bid.name !== '' &&
            bid.bid_status?.id !== undefined &&
            bid.customer?.id !== undefined;

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

    const handleTextFieldChange = (key: keyof Bid, value: string) => {
        setBid((prevBid) => ({
            ...prevBid,
            [key]: value,
        }));
    };

    const handleNumberFieldChange = (key: keyof Bid, value: string) => {
        if (/^\d*\.?\d*$/.test(value)) {
            setBid((prevBid) => ({
                ...prevBid,
                [key]: parseFloat(value),
            }));
        }
    };

    const handleDateChange = (key: keyof Bid, date: dayjs.Dayjs) => {
        setBid({ ...bid, [key]: date });
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

    const handleJobStatusSelectChange = (event: {
        target: { value: SetStateAction<number | undefined> };
    }) => {
        const selectedJobStatusID = event.target.value;
        if (typeof selectedJobStatusID === 'number') {
            const selectedStatus: Status | undefined = jobStatusOptions.find(
                (status: Status) => status.id === selectedJobStatusID
            );
            if (selectedStatus) {
                // @ts-ignore
                setBid({ ...bid, job_status: selectedStatus });
            }
        }
    };

    const handleCustomerChange = (event: {
        target: { value: SetStateAction<number | undefined> };
    }) => {
        const selectedCustomerID = event.target.value;
        if (typeof selectedCustomerID === 'number') {
            const selectedCustomer: Customer | undefined = customers.find(
                (customer: Customer) => customer.id === selectedCustomerID
            );
            if (selectedCustomer) {
                // @ts-ignore
                setBid({ ...bid, customer: selectedCustomer });
            }
        }
    };

    const handleBidManagersChange = (event: {
        target: { value: SetStateAction<number[] | undefined> };
    }) => {
        const selectedManagerIds = event.target.value;
        if (Array.isArray(selectedManagerIds)) {
            const selectedManagers: Manager[] = bidManagers.filter(
                (manager: Manager) => selectedManagerIds.includes(manager.id)
            );
            // @ts-ignore
            setBid({ ...bid, bid_managers: selectedManagers });
        }
    };

    const handleProjectManagersChange = (event: {
        target: { value: SetStateAction<number[] | undefined> };
    }) => {
        const selectedManagerIds = event.target.value;
        if (Array.isArray(selectedManagerIds)) {
            const selectedManagers: Manager[] = projectManagers.filter(
                (manager: Manager) => selectedManagerIds.includes(manager.id)
            );
            // @ts-ignore
            setBid({ ...bid, project_managers: selectedManagers });
        }
    };

    const handleAttributeSelectChange = (
        typeName: string,
        optionId: number
    ) => {
        // @ts-ignore
        setBid((prevBid: Bid | undefined) => {
            if (!prevBid || !prevBid.attributes) return prevBid;

            // Find the index of the attribute with the given type name
            let attributeIndex = prevBid.attributes.findIndex(
                (attribute) => attribute.type.name === typeName
            );

            if (attributeIndex === -1) {
                attributeIndex = prevBid.attributes.length;

                // Find the value of the option ID
                const option = attributes
                    .flatMap((attribute) => attribute.options)
                    .find((option) => option.id === optionId);

                // Update the option ID of the found attribute
                const updatedAttributes = [...prevBid.attributes];

                if (option) {
                    updatedAttributes[attributeIndex] = {
                        ...updatedAttributes[attributeIndex],
                        type: {
                            name: typeName,
                            id: attributeIndex,
                        },
                        option: {
                            value: option.value,
                            id: option.id,
                        },
                    };
                }

                return {
                    ...prevBid,
                    attributes: updatedAttributes,
                };
            } else {
                // Find the value of the option ID
                const option = attributes
                    .flatMap((attribute) => attribute.options)
                    .find((option) => option.id === optionId);

                // Update the option ID of the found attribute
                const updatedAttributes = [...prevBid.attributes];

                if (option) {
                    updatedAttributes[attributeIndex] = {
                        ...updatedAttributes[attributeIndex],
                        option: {
                            value: option.value,
                            id: option.id,
                        },
                    };
                }

                return {
                    ...prevBid,
                    attributes: updatedAttributes,
                };
            }
        });
    };

    const handleAttributeNumericChange = (typeName: string, numVal: number) => {
        // @ts-ignore
        setBid((prevBid: Bid | undefined) => {
            if (!prevBid || !prevBid.attributes) return prevBid;

            // Find the index of the attribute with the given type name
            let attributeIndex = prevBid.attributes.findIndex(
                (attribute) => attribute.type.name === typeName
            );

            if (attributeIndex === -1) {
                attributeIndex = prevBid.attributes.length;

                // Update the num_val of the found attribute
                const updatedAttributes = [...prevBid.attributes];
                updatedAttributes[attributeIndex] = {
                    type: { name: typeName, id: attributeIndex },
                    num_val: numVal,
                };

                return {
                    ...prevBid,
                    attributes: updatedAttributes,
                };
            } else {
                // Update the num_val of the found attribute
                const updatedAttributes = [...prevBid.attributes];
                updatedAttributes[attributeIndex] = {
                    ...updatedAttributes[attributeIndex],
                    num_val: numVal,
                };

                return {
                    ...prevBid,
                    attributes: updatedAttributes,
                };
            }
        });
    };

    const handleCreate = () => {
        const requestBody = getCreateRequestBody(bid);

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

    const handleCancel = () => {
        navigate('/bids');
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
                <Typography color={'text.primary'}>New Bid</Typography>
            </Breadcrumbs>
            {loading ? (
                <Box textAlign={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <Container maxWidth={'lg'}>
                    <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                        <Stack
                            direction={'column'}
                            spacing={1}
                            divider={<Divider />}
                        >
                            <>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'space-between'}
                                >
                                    <Typography
                                        variant={'h6'}
                                        fontWeight={'light'}
                                        paddingBottom={SPACING}
                                    >
                                        General Information
                                    </Typography>
                                </Stack>
                                <Masonry
                                    columns={FIELD_COLUMNS}
                                    spacing={SPACING}
                                >
                                    <TextField
                                        variant={'outlined'}
                                        label={'Name'}
                                        value={bid?.name || ''}
                                        fullWidth
                                        onChange={(e) =>
                                            handleTextFieldChange(
                                                'name',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <SelectStatus
                                        label={'Bid Status'}
                                        options={bidStatusOptions}
                                        value={
                                            bid?.bid_status
                                                ? bid?.bid_status.id
                                                : ''
                                        }
                                        onChange={handleBidStatusSelectChange}
                                        required
                                    />
                                    <SelectStatus
                                        label={'Job Status'}
                                        options={jobStatusOptions}
                                        // @ts-ignore
                                        value={
                                            bid?.job_status
                                                ? bid?.job_status.id
                                                : ''
                                        }
                                        onChange={handleJobStatusSelectChange}
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Original Contract'}
                                        value={bid?.original_contract || ''}
                                        fullWidth
                                        onChange={(e) =>
                                            handleNumberFieldChange(
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
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Final Cost'}
                                        value={bid?.final_cost || ''}
                                        fullWidth
                                        onChange={(e) =>
                                            handleNumberFieldChange(
                                                'final_cost',
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
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Lead'}
                                        value={bid?.lead || ''}
                                        fullWidth
                                        onChange={(e) =>
                                            handleTextFieldChange(
                                                'lead',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Foreman'}
                                        value={bid?.foreman || ''}
                                        fullWidth
                                        onChange={(e) =>
                                            handleTextFieldChange(
                                                'foreman',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Desired Margin'}
                                        value={bid?.desired_margin || ''}
                                        onChange={(e) =>
                                            handleNumberFieldChange(
                                                'desired_margin',
                                                e.target.value
                                            )
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    %
                                                </InputAdornment>
                                            ),
                                        }}
                                        fullWidth
                                    />
                                    <DateTimePicker
                                        label={'Start Date'}
                                        value={
                                            bid?.start_date
                                                ? dayjs(bid?.start_date)
                                                : null
                                        }
                                        onChange={(
                                            date: dayjs.Dayjs | null
                                        ) => {
                                            if (date) {
                                                handleDateChange(
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
                                        onChange={(
                                            date: dayjs.Dayjs | null
                                        ) => {
                                            if (date) {
                                                handleDateChange(
                                                    'finish_date',
                                                    date
                                                );
                                            }
                                        }}
                                    />
                                </Masonry>
                            </>
                            <>
                                <Typography
                                    variant={'h6'}
                                    fontWeight={'light'}
                                    paddingBottom={SPACING}
                                >
                                    People
                                </Typography>
                                <Masonry
                                    columns={FIELD_COLUMNS}
                                    spacing={SPACING}
                                >
                                    <SelectCustomer
                                        options={customers}
                                        value={
                                            bid.customer ? bid?.customer.id : ''
                                        }
                                        onChange={handleCustomerChange}
                                        required
                                    />
                                    <SelectManagers
                                        label={'Bid Managers'}
                                        options={bidManagers}
                                        value={
                                            bid?.bid_managers.map(
                                                (manager) => manager.id
                                            ) || []
                                        }
                                        onChange={handleBidManagersChange}
                                    />
                                    <SelectManagers
                                        label={'Project Managers'}
                                        options={projectManagers}
                                        value={
                                            bid?.project_managers.map(
                                                (manager) => manager.id
                                            ) || []
                                        }
                                        onChange={handleProjectManagersChange}
                                    />
                                </Masonry>
                            </>

                            <>
                                <Typography
                                    variant={'h6'}
                                    fontWeight={'light'}
                                    paddingBottom={SPACING}
                                >
                                    Attributes
                                </Typography>
                                <Masonry
                                    columns={FIELD_COLUMNS}
                                    spacing={SPACING}
                                >
                                    {attributes.map((attribute: Attribute) => {
                                        if (attribute.options.length > 0) {
                                            let value = undefined;
                                            let bidAttribute =
                                                bid?.attributes.find(
                                                    (bidAttribute) =>
                                                        bidAttribute.type
                                                            .name ===
                                                        attribute.name
                                                );
                                            if (
                                                bidAttribute &&
                                                bidAttribute.option
                                            ) {
                                                value = bidAttribute.option.id;
                                            } else {
                                                value = '';
                                            }

                                            return (
                                                <FormControl
                                                    key={attribute.id}
                                                    fullWidth
                                                >
                                                    <InputLabel>
                                                        {convertToSentenceCase(
                                                            attribute.name
                                                        )}
                                                    </InputLabel>
                                                    <Select
                                                        value={value}
                                                        label={convertToSentenceCase(
                                                            attribute.name
                                                        )}
                                                        onChange={(e) =>
                                                            handleAttributeSelectChange(
                                                                attribute.name,
                                                                parseInt(
                                                                    String(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            )
                                                        }
                                                    >
                                                        {attribute.options.map(
                                                            (
                                                                option: AttributeOption
                                                            ) => (
                                                                <MenuItem
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    value={
                                                                        option.id
                                                                    }
                                                                >
                                                                    {
                                                                        option.value
                                                                    }
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            );
                                        } else {
                                            let value = undefined;
                                            let bidAttribute =
                                                bid?.attributes.find(
                                                    (bidAttribute) =>
                                                        bidAttribute.type
                                                            .name ===
                                                        attribute.name
                                                );
                                            if (bidAttribute) {
                                                value = bidAttribute.num_val;
                                            } else {
                                                value = '';
                                            }
                                            return (
                                                <TextField
                                                    key={attribute.id}
                                                    variant={'outlined'}
                                                    label={convertToSentenceCase(
                                                        attribute.name
                                                    )}
                                                    value={value}
                                                    onChange={(e) =>
                                                        handleAttributeNumericChange(
                                                            attribute.name,
                                                            parseInt(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    fullWidth
                                                />
                                            );
                                        }
                                    })}
                                </Masonry>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'flex-end'}
                                    spacing={1}
                                >
                                    <Button
                                        color={'inherit'}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant={'contained'}
                                        onClick={handleCreate}
                                        disabled={!allRequiredFieldsFilled}
                                    >
                                        Create
                                    </Button>
                                </Stack>
                            </>
                        </Stack>
                    </Paper>
                </Container>
            )}
            <Footer />
        </>
    );
};
