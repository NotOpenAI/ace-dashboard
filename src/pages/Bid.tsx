import {
    Breadcrumbs,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BASE_URL, SPACING } from '../constants.tsx';
import Footer from '../components/Footer.tsx';
import { Masonry } from '@mui/lab';
import { useEffect, useState } from 'react';
import CreateAttribute from '../components/createAttribute.tsx';
import DeleteAttribute from '../components/deleteAttribute.tsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DateTimePicker } from '@mui/x-date-pickers';
import * as dayjs from 'dayjs';

interface Bid {
    lead: string;
    margin: number;
    due_date: string;
    id: number;
    approved: boolean;
    final_amt: string;
    initial_bid_amt: string;
    bid_manager: {
        username: string;
        first_name: string;
        last_name: string;
        id: number;
        created_at: string;
        updated_at: string | null;
    };
    customer: {
        name: string;
        phone: string;
        address: string;
        owner: string;
        market: string;
        reputation: number;
        fin_health: number;
        id: number;
        created_at: string;
        updated_at: string | null;
    };
    bid_type: {
        name: string;
        id: number;
    };
    contract_type: {
        name: string;
        id: number;
    };
    estimated_data: {
        start_date: string;
        duration: number;
        mat_cost: string;
        labor_cost: string;
        id: number;
        end_date: string;
        total_cost: string;
        quickbid_amt: string;
        created_at: string;
        updated_at: string | null;
    };
    attributes: {
        num_val: number;
        id: number;
        type: {
            name: string;
            id: number;
        };
        option: string | null;
        created_at: string;
        updated_at: string | null;
    }[];
    created_at: string;
    updated_at: string | null;
}

export const Bid = () => {
    const { id } = useParams();

    const [bid, setBid] = useState<Bid>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBid();
    }, []);

    const fetchBid = () => {
        axios
            .get(`${BASE_URL}/bids/${id}`)
            .then((response) => {
                setBid(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
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
                                defaultValue={bid?.id}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Lead'}
                                defaultValue={bid?.lead}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Margin'}
                                defaultValue={bid?.margin}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position={'end'}>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                            <DateTimePicker
                                label={'Due Date'}
                                defaultValue={dayjs(bid?.due_date)}
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Approved'}
                                defaultValue={bid?.approved}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Final Amount'}
                                defaultValue={bid?.final_amt}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Initial Amount'}
                                defaultValue={bid?.initial_bid_amt}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                            <DateTimePicker
                                label={'Created At'}
                                defaultValue={dayjs(bid?.created_at)}
                                readOnly
                            />
                            <DateTimePicker
                                label={'Updated At'}
                                defaultValue={dayjs(
                                    bid?.updated_at || bid?.created_at
                                )}
                                readOnly
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Bid Type'}
                                defaultValue={bid?.bid_type.name}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Contract Type'}
                                defaultValue={bid?.contract_type.name}
                                fullWidth
                            />
                        </Masonry>
                    </Paper>

                    <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                        <Typography
                            variant={'h6'}
                            fontWeight={'light'}
                            paddingBottom={SPACING}
                        >
                            Bid Manager
                        </Typography>
                        <Masonry columns={2} spacing={SPACING}>
                            <TextField
                                variant={'outlined'}
                                label={'ID'}
                                defaultValue={bid?.bid_manager.id}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Username'}
                                defaultValue={bid?.bid_manager.username}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'First Name'}
                                defaultValue={bid?.bid_manager.first_name}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Last Name'}
                                defaultValue={bid?.bid_manager.last_name}
                                fullWidth
                            />
                            <DateTimePicker
                                label={'Created At'}
                                defaultValue={dayjs(
                                    bid?.bid_manager.created_at
                                )}
                                readOnly
                            />
                            <DateTimePicker
                                label={'Updated At'}
                                defaultValue={dayjs(
                                    bid?.bid_manager.updated_at ||
                                        bid?.bid_manager.created_at
                                )}
                                readOnly
                            />
                        </Masonry>
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
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Name'}
                                defaultValue={bid?.customer.name}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Phone'}
                                defaultValue={bid?.customer.phone}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Address'}
                                defaultValue={bid?.customer.address}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Owner'}
                                defaultValue={bid?.customer.owner}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Market'}
                                defaultValue={bid?.customer.market}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Reputation'}
                                defaultValue={bid?.customer.reputation}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Financial Health'}
                                defaultValue={bid?.customer.fin_health}
                                fullWidth
                            />
                            <DateTimePicker
                                label={'Created At'}
                                defaultValue={dayjs(bid?.customer.created_at)}
                                readOnly
                            />
                            <DateTimePicker
                                label={'Updated At'}
                                defaultValue={dayjs(
                                    bid?.customer.updated_at ||
                                        bid?.customer.created_at
                                )}
                                readOnly
                            />
                        </Masonry>
                    </Paper>

                    <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                        <Typography
                            variant={'h6'}
                            fontWeight={'light'}
                            paddingBottom={SPACING}
                        >
                            Estimated Data
                        </Typography>
                        <Masonry columns={2} spacing={SPACING}>
                            <TextField
                                variant={'outlined'}
                                label={'ID'}
                                defaultValue={bid?.estimated_data.id}
                                fullWidth
                            />
                            <DateTimePicker
                                label={'Start Date'}
                                defaultValue={dayjs(
                                    bid?.estimated_data.start_date
                                )}
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Duration'}
                                defaultValue={bid?.estimated_data.duration}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Material Cost'}
                                defaultValue={bid?.estimated_data.mat_cost}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Labor Cost'}
                                defaultValue={bid?.estimated_data.labor_cost}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                            <DateTimePicker
                                label={'End Date'}
                                defaultValue={dayjs(
                                    bid?.estimated_data.end_date
                                )}
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Total Cost'}
                                defaultValue={bid?.estimated_data.total_cost}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                            <TextField
                                variant={'outlined'}
                                label={'QuickBid Amount'}
                                defaultValue={bid?.estimated_data.quickbid_amt}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position={'start'}>
                                            $
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                            <DateTimePicker
                                label={'End Date'}
                                defaultValue={dayjs(
                                    bid?.estimated_data.created_at
                                )}
                                readOnly
                            />
                            <DateTimePicker
                                label={'Created At'}
                                defaultValue={dayjs(
                                    bid?.estimated_data.created_at
                                )}
                                readOnly
                            />
                            <DateTimePicker
                                label={'Updated At'}
                                defaultValue={dayjs(
                                    bid?.estimated_data.updated_at ||
                                        bid?.estimated_data.created_at
                                )}
                                readOnly
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
                                {bid?.attributes.map((attribute) => (
                                    <TextField
                                        key={attribute.id}
                                        variant={'outlined'}
                                        label={attribute.type.name}
                                        defaultValue={attribute.num_val}
                                        fullWidth
                                    />
                                ))}
                                <CreateAttribute />
                                <DeleteAttribute options={bid.attributes} />
                            </Masonry>
                        </Paper>
                    )}
                </Masonry>
            )}
            <Footer />
        </>
    );
};
