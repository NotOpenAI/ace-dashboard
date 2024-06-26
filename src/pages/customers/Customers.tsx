import {
    Breadcrumbs,
    Button,
    LinearProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import renderCustomerID from '../../renderers/renderCustomerID.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import renderDate from '../../renderers/renderDate.tsx';
import { BASE_URL, SPACING } from '../../constants.tsx';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Customer } from '../../types/Customer.tsx';
import Footer from '../../components/Footer.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteLink } from '../../components/RouteLink.tsx';
import renderLowMediumHigh from '../../renderers/renderLowMediumHigh.tsx';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', renderCell: renderCustomerID },
    { field: 'name', headerName: 'Name', minWidth: 140, flex: 1 },
    {
        field: 'created_at',
        headerName: 'Created At',
        renderCell: renderDate,
        width: 200,
    },
    {
        field: 'updated_at',
        headerName: 'Updated At',
        renderCell: renderDate,
        width: 200,
    },
    { field: 'owner', headerName: 'Owner', width: 150 },
    {
        field: 'market',
        headerName: 'Market',
        renderCell: renderLowMediumHigh,
        width: 150,
    },
    {
        field: 'reputation',
        headerName: 'Reputation',
        renderCell: renderLowMediumHigh,
        width: 120,
    },
    {
        field: 'fin_health',
        headerName: 'Financial Health',
        renderCell: renderLowMediumHigh,
        width: 150,
    },
];

const Customers = () => {
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

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (accessToken) {
            fetchCustomers();
        }
    }, [accessToken]);

    const fetchCustomers = () => {
        axios
            .get(`${BASE_URL}/customers`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setCustomers(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
                    <RouteLink to={'/'} label={'Home'} />
                    <Typography color={'text.primary'}>Customers</Typography>
                </Breadcrumbs>
                <Button
                    size={'small'}
                    variant={'contained'}
                    color={'primary'}
                    sx={{ borderRadius: 4 }}
                    startIcon={<AddCircleRoundedIcon />}
                    component={RouterLink}
                    to={'/customers/new'}
                >
                    Create
                </Button>
            </Stack>
            <Paper
                elevation={1}
                sx={{ borderRadius: 4, width: '100%', marginTop: SPACING }}
            >
                <DataGrid
                    rows={customers}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                            sortModel: [{ field: 'id', sort: 'asc' }],
                        },
                    }}
                    pageSizeOptions={[10, 25]}
                    slots={{ loadingOverlay: LinearProgress }}
                    sx={{ border: 0 }}
                    loading={loading}
                    autoHeight
                />
            </Paper>
            <Footer />
        </>
    );
};
export default Customers;
