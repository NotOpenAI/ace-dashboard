import {
    Breadcrumbs,
    LinearProgress,
    Link,
    Paper,
    Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Footer from '../components/Footer.tsx';
import { useEffect, useState } from 'react';
import axios from 'axios';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'address', headerName: 'Customer Address', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'owner', headerName: 'Owner', width: 150 },
    { field: 'market', headerName: 'Market', width: 150 },
    { field: 'reputation', headerName: 'Reputation', width: 120 },
    { field: 'fin_health', headerName: 'Financial Health', width: 150 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'updated_at', headerName: 'Updated At', width: 200 },
];

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            axios
                .get('http://localhost:8000/customers')
                .then((response) => {
                    setCustomers(response.data.data);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 500);
    }, []);

    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: 2 }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Typography color={'text.primary'}>Customers</Typography>
            </Breadcrumbs>
            <Paper elevation={1} sx={{ borderRadius: 4, width: '100%' }}>
                <DataGrid
                    rows={customers}
                    columns={columns}
                    pageSizeOptions={[5]}
                    slots={{
                        loadingOverlay: LinearProgress,
                    }}
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
