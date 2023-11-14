import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
    { field: 'Customer_No', headerName: 'Customer No', width: 150 },
    { field: 'Customer_Name', headerName: 'Customer Name', flex: 1 },
    { field: 'Cusomer_Address', headerName: 'Customer Address', width: 200 },
    { field: 'Customer_Phone', headerName: 'Customer Phone', width: 150 },
    { field: 'Cusomer_Owner', headerName: 'Customer Owner', width: 150 },
    { field: 'Customer_Market', headerName: 'Customer Market', width: 150 },
    { field: 'Customer_Contact_Name', headerName: 'Contact Name', width: 150 },
    {
        field: 'Customer_Contact_Phone',
        headerName: 'Contact Phone',
        width: 150,
    },
    {
        field: 'Customer_Contact_Email',
        headerName: 'Contact Email',
        width: 200,
    },
    { field: 'Customer_Reputation', headerName: 'Reputation', width: 150 },
    {
        field: 'Customer_Financial_Health',
        headerName: 'Financial Health',
        width: 150,
    },
];

const rows = [
    {
        id: 1,
        Customer_No: 1,
        Customer_Name: 'Customer1',
        Cusomer_Address: 'Street 1, Town 1, NY, 14580',
        Customer_Phone: '585-555-5555',
        Cusomer_Owner: 'Marcin',
        Customer_Market: 'Technology',
        Customer_Contact_Name: 'Marcin',
        Customer_Contact_Phone: '585-555-5555',
        Customer_Contact_Email: 'Marcin@usceiling.com',
        Customer_Reputation: 'Medium',
        Customer_Financial_Health: 'High',
    },
    {
        id: 2,
        Customer_No: 2,
        Customer_Name: 'Customer2',
        Cusomer_Address: 'Street 1, Town 1, NY, 14580',
        Customer_Phone: '585-555-5555',
        Cusomer_Owner: 'Marcin',
        Customer_Market: 'Technology',
        Customer_Contact_Name: 'Marcin',
        Customer_Contact_Phone: '585-555-5555',
        Customer_Contact_Email: 'Marcin@usceiling.com',
        Customer_Reputation: 'Low',
        Customer_Financial_Health: 'Low',
    },
];

const Customers = () => {
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

export default Customers;
