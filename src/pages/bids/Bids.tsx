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
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import renderPercentage from '../../renderers/renderPercentage.tsx';
import renderCustomer from '../../renderers/renderCustomer.tsx';
import renderCurrency from '../../renderers/renderCurrency.tsx';
import renderManagers from '../../renderers/renderManagers.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import renderStatus from '../../renderers/renderStatus.tsx';
import renderBidID from '../../renderers/renderBidID.tsx';
import renderDate from '../../renderers/renderDate.tsx';
import { BASE_URL, SPACING } from '../../constants.tsx';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Footer from '../../components/Footer.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Manager {
    username: string;
    first_name: string;
    last_name: string;
    id: number;
    created_at: string;
    updated_at: string;
}

interface Bid {
    id: number;
    created_at: string;
    customer: {
        name: string;
    };
    finish_date?: string;
    foreman?: string;
    lead?: string;
    name: string;
    original_contract: string;
    original_cost: string;
    start_date?: string;
    updated_at?: string;
    project_managers?: Manager[];
}

export const Bids = () => {
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

    const [bids, setBids] = useState<Bid[]>([]);

    const [topCustomer, setTopCustomer] = useState<{
        name: string;
        totalAmount: number;
    } | null>(null);
    const [topManager, setTopManager] = useState<{
        name: string;
        totalAmount: number;
    } | null>(null);
    const [revenue, setRevenue] = useState<number>(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (accessToken) {
            fetchBids();
        }
    }, [accessToken]);

    useEffect(() => {
        if (bids.length > 0) {
            const customersMap = new Map<
                string,
                { count: number; totalAmount: number }
            >();
            const managersMap = new Map<
                string,
                { count: number; totalAmount: number }
            >();
            let totalRevenue = 0;

            bids.forEach((bid: Bid) => {
                // Calculate total revenue
                const finalAmt = parseFloat(bid.original_contract);
                if (!isNaN(finalAmt)) {
                    totalRevenue += finalAmt;
                }

                // Calculate top customer
                const customer = bid.customer.name;
                if (customersMap.has(customer)) {
                    const customerData = customersMap.get(customer)!;
                    customersMap.set(customer, {
                        count: customerData.count + 1,
                        totalAmount: customerData.totalAmount + finalAmt,
                    });
                } else {
                    customersMap.set(customer, {
                        count: 1,
                        totalAmount: finalAmt,
                    });
                }

                // Calculate top manager
                if (bid.project_managers) {
                    bid.project_managers.forEach((manager) => {
                        const managerKey = `${manager.first_name} ${manager.last_name}`;
                        if (managersMap.has(managerKey)) {
                            const managerData = managersMap.get(managerKey)!;
                            managersMap.set(managerKey, {
                                count: managerData.count + 1,
                                totalAmount: managerData.totalAmount + finalAmt,
                            });
                        } else {
                            managersMap.set(managerKey, {
                                count: 1,
                                totalAmount: finalAmt,
                            });
                        }
                    });
                }
            });

            // Determine top customer
            let topCustomer = '';
            let maxCustomerAmount = 0;
            customersMap.forEach(({ totalAmount }, customer) => {
                if (totalAmount > maxCustomerAmount) {
                    topCustomer = customer;
                    maxCustomerAmount = totalAmount;
                }
            });
            setTopCustomer({
                name: topCustomer,
                totalAmount: maxCustomerAmount,
            });

            // Determine top manager
            let topManager = '';
            let maxManagerAmount = 0;
            managersMap.forEach(({ totalAmount }, manager) => {
                if (totalAmount > maxManagerAmount) {
                    topManager = manager;
                    maxManagerAmount = totalAmount;
                }
            });
            setTopManager({ name: topManager, totalAmount: maxManagerAmount });

            // Set total revenue
            setRevenue(totalRevenue);
        }
    }, [bids]);

    const fetchBids = () => {
        axios
            .get(`${BASE_URL}/bids`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setBids(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            renderCell: renderBidID,
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 300,
            flex: 1,
        },
        {
            field: 'bid_status',
            headerName: 'Bid Status',
            renderCell: renderStatus,
            width: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: 'job_status',
            headerName: 'Job Status',
            renderCell: renderStatus,
            width: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: 'customer',
            headerName: 'Customer',
            renderCell: renderCustomer,
            minWidth: 280,
            flex: 1,
            filterable: false,
        },
        {
            field: 'start_date',
            headerName: 'Start Date',
            renderCell: renderDate,
            width: 170,
        },
        {
            field: 'finish_date',
            headerName: 'Finish Date',
            renderCell: renderDate,
            width: 170,
        },
        {
            field: 'bid_managers',
            headerName: 'Bid Managers',
            renderCell: renderManagers,
            width: 250,
            filterable: false,
            sortable: false,
        },
        {
            field: 'project_managers',
            headerName: 'Project Managers',
            renderCell: renderManagers,
            width: 250,
            filterable: false,
            sortable: false,
        },
        {
            field: 'foreman',
            headerName: 'Foreman',
            width: 160,
        },
        {
            field: 'lead',
            headerName: 'Lead',
            width: 160,
        },
        {
            field: 'original_contract',
            headerName: 'Original Contract',
            renderCell: renderCurrency,
            width: 160,
        },
        {
            field: 'final_cost',
            headerName: 'Final Cost',
            renderCell: renderCurrency,
            width: 160,
        },
        {
            field: 'desired_margin',
            headerName: 'Desired Margin',
            renderCell: renderPercentage,
            width: 160,
        },
        {
            field: 'actual_margin',
            headerName: 'Actual Margin',
            renderCell: renderPercentage,
            width: 160,
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            renderCell: renderDate,
            width: 170,
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            renderCell: renderDate,
            width: 170,
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
                          'Top Customer',
                          'Top Manager',
                          'Total Original Contract Value',
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
                                  <Typography
                                      color={'text.primary'}
                                      sx={{ textAlign: 'right' }}
                                  >
                                      {title === 'Total Bids' && bids.length}
                                      {title === 'Top Manager' &&
                                          topManager &&
                                          `${
                                              topManager.name
                                          } ${topManager.totalAmount.toLocaleString(
                                              'en-US',
                                              {
                                                  style: 'currency',
                                                  currency: 'USD',
                                              }
                                          )}`}
                                      {title === 'Top Customer' &&
                                          topCustomer &&
                                          `${
                                              topCustomer.name
                                          } ${topCustomer.totalAmount.toLocaleString(
                                              'en-US',
                                              {
                                                  style: 'currency',
                                                  currency: 'USD',
                                              }
                                          )}`}
                                      {title ===
                                          'Total Original Contract Value' &&
                                          `${revenue.toLocaleString('en-US', {
                                              style: 'currency',
                                              currency: 'USD',
                                          })}`}
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
                    initialState={{
                        sorting: {
                            sortModel: [{ field: 'id', sort: 'desc' }],
                        },
                    }}
                    autoHeight
                    disableRowSelectionOnClick
                />
            </Paper>
            <Footer />
        </>
    );
};
