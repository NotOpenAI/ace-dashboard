import {Box} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";

const columns: GridColDef[] = [
    { field: 'foo', headerName: 'Foo', width: 200 },
];

const rows = [
    {
        id: 1,
        foo: 'bar',
    }
];

const OperationalData = () => {
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

export default OperationalData;
