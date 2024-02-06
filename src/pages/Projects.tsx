import { Breadcrumbs, Link, Paper, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DataGrid } from '@mui/x-data-grid';
import Footer from '../components/Footer.tsx';
import { useState } from 'react';

const Projects = () => {
    const [data] = useState({
        columns: [
            { field: 'project_id', headerName: 'ID', width: 150 },
            { field: 'name', headerName: 'Name', width: 150 },
        ],
        rows: [
            { id: 1, project_id: 1, name: 'Project 1' },
            { id: 2, project_id: 2, name: 'Project 2' },
        ],
        initialState: {},
        experimentalFeatures: {},
    });
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
                <DataGrid {...data} sx={{ border: 0 }} />
            </Paper>
            <Footer />
        </>
    );
};

export default Projects;
