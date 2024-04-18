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
    Comment,
    jobStatusOptions,
    Status,
} from '../../types/Bid.tsx';
import {
    NavLink as RouterLink,
    useNavigate,
    useParams,
} from 'react-router-dom';
import RecommendedActionModal from '../../components/modal/RecommendedActionModal.tsx';
import UpdateBidConfirmation from '../../components/updateBidConfirmation.tsx';
import { SelectManagers } from '../../components/select/SelectManagers.tsx';
import { SelectCustomer } from '../../components/select/SelectCustomer.tsx';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import { SelectStatus } from '../../components/select/SelectStatus.tsx';
import { BASE_URL, FIELD_COLUMNS, SPACING } from '../../constants.tsx';
import CreateAttribute from '../../components/createAttribute.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SetStateAction, useEffect, useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { compareBids } from '../../utils/compareBids.tsx';
import { DateTimePicker } from '@mui/x-date-pickers';
import FormControl from '@mui/material/FormControl';
import { Customer } from '../../types/Customer.tsx';
import InputLabel from '@mui/material/InputLabel';
import Footer from '../../components/Footer.tsx';
import { Manager } from '../../types/Role.tsx';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import { Masonry } from '@mui/lab';
import axios from 'axios';
import dayjs from 'dayjs';

export const BidInfo = () => {
    const { id } = useParams();

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

    const [bid, setBid] = useState<Bid>();
    const [originalBid, setOriginalBid] = useState<Bid>();

    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [bidManagers, setBidManagers] = useState<Manager[]>([]);
    const [projectManagers, setProjectManagers] = useState<Manager[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(true);

    const [saveDisabled, setSaveDisabled] = useState(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (accessToken) {
            fetchAllData();
        }
    }, [accessToken]);

    const fetchAllData = async () => {
        try {
            await Promise.all([
                fetchBid(),
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

    const fetchBid = async () => {
        const response = await axios.get(`${BASE_URL}/bids/${id}`, {
            headers: {
                Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
            },
        });
        setBid(response.data.data);
        setOriginalBid(response.data.data);
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

    const handleTextFieldChange = (key: string, value: string) => {
        // @ts-ignore
        setBid((prevBid: Bid | undefined) => {
            if (!prevBid) return prevBid;
            return {
                ...prevBid,
                [key]: value,
            };
        });
    };

    const handleNumberFieldChange = (key: string, value: string) => {
        // Regular expression to match only numbers
        if (/^\d*\.?\d*$/.test(value)) {
            setBid((prevBid: Bid | undefined) => {
                if (!prevBid) return prevBid;
                return {
                    ...prevBid,
                    [key]: value,
                };
            });
        }
    };

    const handleDateChange = (key: keyof Bid, date: dayjs.Dayjs) => {
        // @ts-ignore
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

    const handleUpdateBidAfterRecommendation = (
        option: 'Accepted' | 'Rejected',
        comment?: Comment
    ) => {
        const selectedStatus: Status | undefined = bidStatusOptions.find(
            (status: Status) => status.value === option
        );
        if (selectedStatus && comment) {
            // @ts-ignore
            setBid({
                ...bid,
                bid_status: selectedStatus,
                // @ts-ignore
                comments: [...bid.comments, comment],
            });
        } else if (selectedStatus) {
            // @ts-ignore
            setBid({
                ...bid,
                bid_status: selectedStatus,
            });
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

    const handleAddAttribute = () => {
        fetchAttributeTypes().then(() =>
            enqueueSnackbar('Created attribute', {
                variant: 'success',
            })
        );
    };

    const handleAddComment = (comment: Comment) => {
        // Make sure bid is not null or undefined
        if (bid) {
            // Create a copy of the bid object to avoid mutating the original
            const updatedBid = { ...bid };

            // Add the new comment to the comments array
            updatedBid.comments = [...updatedBid.comments, comment];

            // Update the bid state with the modified bid object
            setBid(updatedBid);
        }
    };

    const handleUpdateComment = (text: string, index: number) => {
        // Make sure bid is not null or undefined
        if (bid) {
            // Create a copy of the bid object to avoid mutating the original
            const updatedBid = { ...bid };

            // Make sure the comments array exists
            if (updatedBid.comments && updatedBid.comments.length > index) {
                // Update the comment at the specified index
                updatedBid.comments[index].text = text;

                // Update the bid state with the modified bid object
                setBid(updatedBid);
            }
        }
    };

    const handleUpdate = () => {
        if (originalBid && bid) {
            const requestBody = compareBids(originalBid, bid);

            axios
                .put(`${BASE_URL}/bids/${id}`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${encodeURIComponent(
                            accessToken
                        )}`,
                    },
                })
                .then((response) => {
                    setOriginalBid(response.data.data);
                    enqueueSnackbar('Updated bid', { variant: 'success' });
                    fetchAllData();
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
                    setBid(originalBid);
                })
                .finally(() => setSaveDisabled(true));
        }
    };

    const handleCancel = () => {
        enqueueSnackbar('Canceled bid update', { variant: 'warning' });
        setBid(originalBid);
    };

    useEffect(() => {
        if (originalBid && bid) {
            let difference = compareBids(originalBid, bid);
            setSaveDisabled(Object.keys(difference).length === 0);
        }
    }, [bid, originalBid]);

    // @ts-ignore
    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: 2 }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Link href={'/bids'} color={'inherit'} underline={'hover'}>
                    Bids
                </Link>
                <Typography color={'text.primary'}>{bid?.id}</Typography>
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
                                    {id && bid?.name && (
                                        <RecommendedActionModal
                                            id={parseInt(id)}
                                            name={bid?.name}
                                            desiredMargin={
                                                bid.desired_margin * 100
                                            }
                                            handleUpdateBidAfterRecommendation={
                                                handleUpdateBidAfterRecommendation
                                            }
                                        />
                                    )}
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
                                    />
                                    <SelectStatus
                                        label={'Job Status'}
                                        options={jobStatusOptions}
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
                                        fullWidth
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Actual Margin'}
                                        value={bid?.actual_margin || ''}
                                        disabled
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
                                            bid?.customer
                                                ? bid?.customer.id
                                                : ''
                                        }
                                        onChange={handleCustomerChange}
                                        disabled
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
                                    <CreateAttribute
                                        handleAddAttribute={handleAddAttribute}
                                    />
                                </Masonry>
                            </>
                            <>
                                <Typography
                                    variant={'h6'}
                                    fontWeight={'light'}
                                    paddingBottom={SPACING}
                                >
                                    Comments
                                </Typography>
                                <Stack direction={'column'} spacing={2}>
                                    {bid?.comments &&
                                        bid?.comments.length > 0 &&
                                        bid?.comments.map(
                                            (comment: Comment, index) => (
                                                <Stack
                                                    key={index}
                                                    direction={'row'}
                                                    spacing={1}
                                                >
                                                    {comment.author &&
                                                        comment.created_at && (
                                                            <Stack
                                                                direction={
                                                                    'column'
                                                                }
                                                                justifyContent={
                                                                    'space-between'
                                                                }
                                                                spacing={1}
                                                            >
                                                                <Tooltip
                                                                    title={
                                                                        'Author'
                                                                    }
                                                                    arrow
                                                                >
                                                                    <Button
                                                                        key={
                                                                            comment
                                                                                .author
                                                                                ?.id
                                                                        }
                                                                        size={
                                                                            'large'
                                                                        }
                                                                        startIcon={
                                                                            <OpenInNewIcon />
                                                                        }
                                                                        color={
                                                                            'inherit'
                                                                        }
                                                                        variant={
                                                                            'outlined'
                                                                        }
                                                                        sx={{
                                                                            textTransform:
                                                                                'none',
                                                                        }}
                                                                        component={
                                                                            RouterLink
                                                                        }
                                                                        to={`/users/${comment.author?.id}`}
                                                                        target={
                                                                            '_blank'
                                                                        }
                                                                    >
                                                                        {`${comment.author?.first_name} ${comment.author?.last_name}`}
                                                                    </Button>
                                                                </Tooltip>
                                                                <DateTimePicker
                                                                    label={
                                                                        'Created At'
                                                                    }
                                                                    value={
                                                                        comment.created_at
                                                                            ? dayjs(
                                                                                  comment.created_at
                                                                              )
                                                                            : null
                                                                    }
                                                                    disabled
                                                                />
                                                            </Stack>
                                                        )}
                                                    <TextField
                                                        variant={'outlined'}
                                                        label={
                                                            comment.editable
                                                                ? 'New Comment'
                                                                : 'Comment'
                                                        }
                                                        multiline
                                                        rows={4}
                                                        value={
                                                            comment.text || ''
                                                        }
                                                        onChange={(e) =>
                                                            handleUpdateComment(
                                                                e.target.value,
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            !comment.editable
                                                        }
                                                        fullWidth
                                                    />
                                                </Stack>
                                            )
                                        )}
                                    <Button
                                        onClick={() =>
                                            handleAddComment({
                                                text: '',
                                                editable: true,
                                            })
                                        }
                                        sx={{ height: 56 }}
                                    >
                                        Add
                                    </Button>
                                </Stack>
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
                                        onClick={handleUpdate}
                                        disabled={saveDisabled}
                                    >
                                        Save
                                    </Button>
                                    <UpdateBidConfirmation
                                        requestBody={
                                            originalBid && bid
                                                ? compareBids(originalBid, bid)
                                                : {}
                                        }
                                        onSave={handleUpdate}
                                        disabled={saveDisabled}
                                    />
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
