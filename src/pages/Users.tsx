import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'username', headerName: 'Username', width: 120 },
];

const rows = [
    {
        id: 1,
        username: 'bmontijo',
    },
];

const Users = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5]}
                checkboxSelection
                sx={{
                    borderRadius: 4,
                }}
            />
        </Box>
    );
};

export default Users;
