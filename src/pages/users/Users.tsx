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
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import renderUserID from '../../renderers/renderUserID.tsx';
import renderRoles from '../../renderers/renderRoles.tsx';
import renderDate from '../../renderers/renderDate.tsx';
import { BASE_URL, SPACING } from '../../constants.tsx';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Footer from '../../components/Footer.tsx';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/User.tsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteLink } from '../../components/RouteLink.tsx';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', renderCell: renderUserID },
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'first_name', headerName: 'First Name', width: 140 },
    { field: 'last_name', headerName: 'Last Name', width: 140 },
    {
        field: 'roles',
        headerName: 'Roles',
        renderCell: renderRoles,
        minWidth: 140,
        flex: 1,
    },
    {
        field: 'created_at',
        headerName: 'Created At',
        renderCell: renderDate,
        width: 160,
    },
    {
        field: 'updated_at',
        headerName: 'Updated At',
        renderCell: renderDate,
        width: 160,
    },
];

const Users = () => {
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
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (accessToken) {
            setLoading(true);
            fetchUsers();
        }
    }, [accessToken]);

    const fetchUsers = () => {
        axios
            .get(`${BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setUsers(response.data.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
                    <RouteLink to={'/'} label={'Home'} />
                    <Typography color={'text.primary'}>Users</Typography>
                </Breadcrumbs>
                <Button
                    size={'small'}
                    variant={'contained'}
                    color={'primary'}
                    sx={{ borderRadius: 4 }}
                    startIcon={<AddCircleRoundedIcon />}
                    component={RouterLink}
                    to={'/users/new'}
                >
                    Create
                </Button>
            </Stack>
            <Paper elevation={1} sx={{ borderRadius: 4, marginTop: SPACING }}>
                <DataGrid
                    columns={columns}
                    rows={users}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                            sortModel: [{ field: 'id', sort: 'asc' }],
                        },
                    }}
                    pageSizeOptions={[10, 25]}
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

export default Users;
