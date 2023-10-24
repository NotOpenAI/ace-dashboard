import {Box} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
];

const rows = [
    {
        id: 1,
        name: 'Brandon Montijo',
    }
];

const Customers = () => {
    return (
        <Box sx={{width: '100%'}}>
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

export default Customers;
