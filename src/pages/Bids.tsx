import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useEffect, useState } from 'react';
import {
    Breadcrumbs,
    Button,
    LinearProgress,
    Link,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import Footer from '../components/Footer.tsx';
import { BASE_URL, SPACING } from '../constants.tsx';
import axios from 'axios';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import renderBidType from '../renderer/renderBidType.tsx';
import renderContractType from '../renderer/renderContractType.tsx';
import renderBidManager from '../renderer/renderBidManager.tsx';
import renderCurrency from '../renderer/renderCurrency.tsx';
import renderPercentage from '../renderer/renderPercentage.tsx';
import renderBidID from '../renderer/renderBidID.tsx';
import renderDate from '../renderer/renderDate.tsx';

interface Bid {
    id: number;
    lead: string;
    margin: number;
    due_date: string;
    approved: boolean;
    final_amt: string;
    initial_bid_amt: string;
    bid_manager: {
        username: string;
        first_name: string;
        last_name: string;
        id: number;
    };
    bid_type: {
        name: string;
        id: number;
    };
    contract_type: {
        name: string;
        id: number;
    };
    created_at: string;
    updated_at: string | null;
}

export default function Bids() {
    const [bids, setBids] = useState<Bid[]>([]);

    const [topManager, setTopManager] = useState<string>('');
    const [revenue, setRevenue] = useState<number>(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBids();
    }, []);

    useEffect(() => {
        if (bids.length > 0) {
            const managersMap = new Map<string, number>();
            let totalRevenue = 0;
            bids.forEach((bid: Bid) => {
                const manager = bid.bid_manager.username;
                const finalAmt = parseFloat(bid.final_amt);
                if (!isNaN(finalAmt)) {
                    if (managersMap.has(manager)) {
                        managersMap.set(
                            manager,
                            managersMap.get(manager)! + finalAmt
                        );
                    } else {
                        managersMap.set(manager, finalAmt);
                    }
                    totalRevenue += finalAmt;
                }
            });
            const sortedManagers = Array.from(managersMap.entries()).sort(
                (a, b) => b[1] - a[1]
            );
            setTopManager(sortedManagers[0][0]);
            setRevenue(totalRevenue);
        }
    }, [bids]);

    const fetchBids = () => {
        axios
            .get(`${BASE_URL}/bids`)
            .then((response) => {
                setBids(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', renderCell: renderBidID },
        {
            field: 'approved',
            headerName: 'Approved',
            type: 'boolean',
            width: 100,
        },
        {
            field: 'bid_manager',
            headerName: 'Bid Manager',
            renderCell: renderBidManager,
            minWidth: 180,
        },
        {
            field: 'lead',
            headerName: 'Lead',
            width: 100,
            flex: 1,
        },
        {
            field: 'margin',
            headerName: 'Margin',
            type: 'number',
            renderCell: renderPercentage,
            width: 100,
        },
        {
            field: 'due_date',
            headerName: 'Due Date',
            renderCell: renderDate,
            width: 100,
        },
        {
            field: 'final_amt',
            headerName: 'Final Amount',
            type: 'number',
            renderCell: renderCurrency,
            width: 150,
        },
        {
            field: 'initial_bid_amt',
            headerName: 'Initial Bid Amount',
            type: 'number',
            renderCell: renderCurrency,
            width: 180,
        },
        {
            field: 'bid_type',
            headerName: 'Bid Type',
            renderCell: renderBidType,
            minWidth: 150,
        },
        {
            field: 'contract_type',
            headerName: 'Contract Type',
            renderCell: renderContractType,
            minWidth: 150,
        },
    ];

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
                    <Link href={'/'} color={'inherit'} underline={'hover'}>
                        Home
                    </Link>
                    <Typography color={'text.primary'}>Bids</Typography>
                </Breadcrumbs>
                <Button
                    size={'small'}
                    variant={'contained'}
                    color={'primary'}
                    sx={{ borderRadius: 4 }}
                    startIcon={<AddCircleRoundedIcon />}
                    component={Link}
                    href={'/bids/new'}
                >
                    Create
                </Button>
            </Stack>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                spacing={SPACING}
                sx={{ paddingY: SPACING }}
            >
                {loading
                    ? [1, 2, 3, 4].map((index) => (
                          <Skeleton
                              key={index}
                              variant={'rounded'}
                              sx={{ borderRadius: 4, p: 6, width: '100%' }}
                          />
                      ))
                    : [
                          'Total Bids',
                          'Total Customers',
                          'Top Manager',
                          'Revenue',
                      ].map((title) => (
                          <Paper
                              key={title}
                              elevation={1}
                              sx={{ borderRadius: 4, p: 4, width: '100%' }}
                          >
                              <Stack
                                  direction={'row'}
                                  alignItems={'center'}
                                  justifyContent={'space-between'}
                              >
                                  <Typography color={'text.primary'}>
                                      {title}
                                  </Typography>
                                  <Typography color={'text.primary'}>
                                      {title === 'Total Bids' && bids.length}
                                      {title === 'Total Customers' && 1}
                                      {title === 'Top Manager' && topManager}
                                      {title === 'Revenue' &&
                                          `$${revenue.toLocaleString()}`}
                                  </Typography>
                              </Stack>
                          </Paper>
                      ))}
            </Stack>
            <Paper elevation={1} sx={{ borderRadius: 4 }}>
                <DataGrid
                    rows={bids}
                    columns={columns}
                    slots={{ loadingOverlay: LinearProgress }}
                    sx={{ border: 0 }}
                    loading={loading}
                    autoHeight
                    disableRowSelectionOnClick
                />
            </Paper>
            <Footer />
        </>
    );
}
