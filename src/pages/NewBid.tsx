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
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BASE_URL, SPACING } from '../constants.tsx';
import Footer from '../components/Footer.tsx';
import { Masonry } from '@mui/lab';
import { useEffect, useState } from 'react';
import CreateAttribute from '../components/createAttribute.tsx';
import DeleteAttribute from '../components/deleteAttribute.tsx';
import { NavLink as RouterLink } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers';
import * as dayjs from 'dayjs';
import { Bid } from './Bid.tsx';
import CustomSelect from '../components/customSelect.tsx';
import axios from 'axios';

interface Customer {
    address: string;
    created_at: string;
    fin_health: number;
    id: number;
    market: string;
    name: string;
    owner: string;
    phone: string;
    reputation: number;
    updated_at: string;
}

export const NewBid = () => {
    const [bid] = useState<Bid>();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        axios
            .get(`${BASE_URL}/customers`)
            .then((response) => setCustomers(response.data.data))
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
                <Typography color={'text.primary'}>New</Typography>
            </Breadcrumbs>
            {loading ? (
                <Box textAlign={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
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
                                label={'Lead'}
                                defaultValue={bid?.lead}
                                fullWidth
                                required
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
                                required
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
                                required
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
                                required
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
                                required
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Bid Type'}
                                defaultValue={bid?.bid_type.name}
                                fullWidth
                                required
                            />
                            <TextField
                                variant={'outlined'}
                                label={'Contract Type'}
                                defaultValue={bid?.contract_type.name}
                                fullWidth
                                required
                            />
                            <CustomSelect
                                label={'Bid Manager'}
                                options={[]}
                                required={true}
                            />
                            <CustomSelect
                                label={'Customer'}
                                options={customers.map(
                                    (customer) => customer.name
                                )}
                                required={true}
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
                                required
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
                                required
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
                                required
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
                <Button variant={'contained'} disabled>
                    Create
                </Button>
            </Stack>
            <Footer />
        </>
    );
};
