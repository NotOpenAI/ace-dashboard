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
    BASE_URL,
    FIELD_COLUMNS,
    PAGE_COLUMNS,
    SPACING,
} from '../../constants.tsx';
import { Attribute, AttributeOption, Bid, Status } from '../../types/Bid.tsx';
import { SelectManagers } from '../../components/select/SelectManagers.tsx';
import { SelectCustomer } from '../../components/select/SelectCustomer.tsx';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import { SelectStatus } from '../../components/select/SelectStatus.tsx';
import CreateAttribute from '../../components/createAttribute.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import { Customer } from '../../types/Customer.tsx';
import InputLabel from '@mui/material/InputLabel';
import Footer from '../../components/Footer.tsx';
import { Manager } from '../../types/Role.tsx';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import { Masonry } from '@mui/lab';
import axios from 'axios';

export const BidV3 = () => {
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
    const [projectManagers, setProjectManagers] = useState<Manager[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [loading, setLoading] = useState(true);

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

    const bidStatusOptions: Status[] = [
        {
            id: 1,
            value: 'New',
        },
        {
            id: 2,
            value: 'Rejected',
        },
        {
            id: 3,
            value: 'Accepted',
        },
    ];

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

    const jobStatusOptions: Status[] = [
        {
            id: 1,
            value: 'Active',
        },
        {
            id: 2,
            value: 'Completed',
        },
    ];

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

    const handleAttributeChange = (typeName: string, optionId: number) => {
        setBid((prevBid: Bid | undefined) => {
            console.log('Attribute:', typeName, 'Option:', optionId);
            if (!prevBid || !prevBid.attributes) return prevBid;

            // Find the index of the attribute with the given type name
            const attributeIndex = prevBid.attributes.findIndex(
                (attribute) => attribute.type.name === typeName
            );

            if (attributeIndex === -1) {
                console.log('new attr');
            } else {
                // Find the value of the option ID
                const option = attributes
                    .flatMap((attribute) => attribute.options)
                    .find((option) => option.id === optionId);

                // Update the option ID of the found attribute
                const updatedAttributes = [...prevBid.attributes];

                updatedAttributes[attributeIndex] = {
                    ...updatedAttributes[attributeIndex],
                    option: {
                        value: option.value,
                        id: option.id,
                    },
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

    const handleUpdate = () => {
        console.log(bid);
        // if (bid) {
        //     const requestBody = {
        //         ...(bid.name !== originalBid?.name && { name: bid.name }),
        //         ...(bid.lead !== originalBid?.lead && { lead: bid.lead }),
        //         ...(bid.bid_managers !== originalBid?.bid_managers && {
        //             bid_manager_ids: bid.bid_managers.map(
        //                 (manager: Manager) => manager.id
        //             ),
        //         }),
        //         ...(bid.project_managers !== originalBid?.project_managers && {
        //             project_manager_ids: bid.project_managers.map(
        //                 (manager: Manager) => manager.id
        //             ),
        //         }),
        //         ...(bid.foreman !== originalBid?.foreman && {
        //             foreman: bid.foreman,
        //         }),
        //         ...(bid.start_date !== originalBid?.start_date && {
        //             start_date: bid.start_date,
        //         }),
        //         ...(bid.finish_date !== originalBid?.finish_date && {
        //             finish_date: bid.finish_date,
        //         }),
        //         ...(bid.bid_status !== originalBid?.bid_status && {
        //             bid_status_id: bid.bid_status.id,
        //         }),
        //         ...(bid.job_status !== originalBid?.job_status && {
        //             job_status_id: bid.job_status.id,
        //         }),
        //         ...(bid.original_contract !==
        //             originalBid?.original_contract && {
        //             original_contract: bid.original_contract,
        //         }),
        //         ...(bid.comments !== originalBid?.comments && {
        //             new_comments: bid.comments,
        //         }),
        //         ...(bid.final_cost !== originalBid?.final_cost && {
        //             final_cost: bid.final_cost,
        //         }),
        //         ...(bid.attributes !== originalBid?.attributes && {
        //             attributes: bid.attributes,
        //         }),
        //     };
        //
        //     axios
        //         .put(`${BASE_URL}/bids/${id}`, requestBody, {
        //             headers: {
        //                 Authorization: `Bearer ${encodeURIComponent(
        //                     accessToken
        //                 )}`,
        //             },
        //         })
        //         .then((response) => {
        //             setOriginalBid(response.data.data);
        //             enqueueSnackbar('Updated bid', { variant: 'success' });
        //         })
        //         .catch((error) => {
        //             if (typeof error.response.data.detail === 'object') {
        //                 error.response.data.detail.map(
        //                     (error: { msg: string }) =>
        //                         enqueueSnackbar(error.msg, { variant: 'error' })
        //                 );
        //             } else {
        //                 enqueueSnackbar(error.response.data.detail, {
        //                     variant: 'error',
        //                 });
        //             }
        //             setBid(originalBid);
        //         });
        // }
    };

    const handleCancel = () => {
        enqueueSnackbar('Canceled bid update', { variant: 'warning' });
        setBid(originalBid);
    };

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
                                <Typography
                                    variant={'h6'}
                                    fontWeight={'light'}
                                    paddingBottom={SPACING}
                                >
                                    General Information
                                </Typography>
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
                                        value={bid?.bid_status.id}
                                        onChange={handleBidStatusSelectChange}
                                    />
                                    <SelectStatus
                                        label={'Job Status'}
                                        options={jobStatusOptions}
                                        value={bid?.job_status.id}
                                        onChange={handleJobStatusSelectChange}
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
                                        onChange={(e) =>
                                            handleNumberFieldChange(
                                                'actual_margin',
                                                e.target.value
                                            )
                                        }
                                        fullWidth
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
                                        value={bid?.customer.id}
                                        onChange={handleCustomerChange}
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
                                            if (bidAttribute) {
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
                                                            handleAttributeChange(
                                                                attribute.name,
                                                                parseInt(
                                                                    e.target
                                                                        .value
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
                                                    // onChange={(e) =>
                                                    //     handleNumberFieldChange(
                                                    //         'actual_margin',
                                                    //         e.target.value
                                                    //     )
                                                    // }
                                                    fullWidth
                                                />
                                            );
                                        }
                                    })}
                                    <CreateAttribute
                                        handleAddAttribute={handleAddAttribute}
                                    />
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
                                        onClick={handleUpdate}
                                        disabled={bid === originalBid}
                                    >
                                        Save
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