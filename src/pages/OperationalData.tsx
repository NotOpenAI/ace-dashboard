import { Breadcrumbs, Link, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Footer from '../components/Footer.tsx';

const columns: GridColDef[] = [{ field: 'foo', headerName: 'Foo', width: 200 }];

const rows = [
    {
        id: 1,
        foo: 'bar',
    },
];

const OperationalData = () => {
    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: 2 }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Typography color={'text.primary'}>Operational Data</Typography>
            </Breadcrumbs>
            <Paper elevation={1} sx={{ borderRadius: 4, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    sx={{ border: 0 }}
                />
            </Paper>
            <Footer />
        </>
    );
};

export default OperationalData;
