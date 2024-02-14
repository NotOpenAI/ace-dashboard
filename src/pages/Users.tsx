import {
    Breadcrumbs,
    Button,
    LinearProgress,
    Link,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import renderRoles from '../renderer/renderRoles.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Footer from '../components/Footer.tsx';
import axios from 'axios';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'first_name', headerName: 'First Name', width: 140 },
    { field: 'last_name', headerName: 'Last Name', width: 140 },
    {
        field: 'roles',
        headerName: 'Roles',
        renderCell: renderRoles,
        flex: 1,
    },
    { field: 'created_at', headerName: 'Created At', width: 160 },
    { field: 'updated_at', headerName: 'Updated At', width: 160 },
];

const UsersToolbar = () => {
    return (
        <GridToolbarContainer style={{ width: '100%', display: 'block' }}>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignContent={'space-between'}
                spacing={1}
            >
                <Stack direction={'row'} spacing={1}>
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                </Stack>
                <Stack direction={'row'} spacing={1}>
                    <Button>New User</Button>
                </Stack>
            </Stack>
        </GridToolbarContainer>
    );
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            axios
                .get('http://localhost:8000/users')
                .then((response) => {
                    setUsers(response.data.data);
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
                <Typography color={'text.primary'}>Users</Typography>
            </Breadcrumbs>
            <Paper elevation={1} sx={{ borderRadius: 4 }}>
                <DataGrid
                    columns={columns}
                    rows={users}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25]}
                    slots={{
                        loadingOverlay: LinearProgress,
                        toolbar: UsersToolbar,
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

export default Users;
