import {
    Breadcrumbs,
    Button,
    LinearProgress,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import renderAttributeOptions from '../../renderers/renderAttributeOptions.tsx';
import renderAttributeName from '../../renderers/renderAttributeName.tsx';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import renderAttributeID from '../../renderers/renderAttributeID.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BASE_URL, SPACING } from '../../constants.tsx';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Footer from '../../components/Footer.tsx';
import { Attribute } from '../../types/Bid.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { RouteLink } from '../../components/RouteLink.tsx';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', renderCell: renderAttributeID },
    {
        field: 'name',
        headerName: 'Name',
        renderCell: renderAttributeName,
        minWidth: 140,
        flex: 1,
    },
    {
        field: 'options',
        headerName: 'Options',
        minWidth: 200,
        renderCell: renderAttributeOptions,
        flex: 2,
    },
    { field: 'active', headerName: 'Active', type: 'boolean', width: 150 },
    { field: 'required', headerName: 'Required', type: 'boolean', width: 150 },
];
export const Attributes = () => {
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

    const [loading, setLoading] = useState(true);
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    useEffect(() => {
        if (accessToken) {
            fetchData();
        }
    }, [accessToken]);

    const fetchData = () => {
        axios
            .get(`${BASE_URL}/bids/attribute-types`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setAttributes(response.data.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
                    <RouteLink to={'/'} label={'Home'} />
                    <Typography color={'text.primary'}>Attributes</Typography>
                </Breadcrumbs>
                <Button
                    size={'small'}
                    variant={'contained'}
                    color={'primary'}
                    sx={{ borderRadius: 4 }}
                    startIcon={<AddCircleRoundedIcon />}
                    component={RouterLink}
                    to={'/attributes/new'}
                >
                    Create
                </Button>
            </Stack>
            <Paper
                elevation={1}
                sx={{
                    borderRadius: 4,
                    width: '100%',
                    marginTop: SPACING,
                }}
            >
                <DataGrid
                    rows={attributes}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[10, 25]}
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
};
