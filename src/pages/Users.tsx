import { Box, Button, Stack } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRowsProp,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridValidRowModel,
} from '@mui/x-data-grid';
import { useState } from 'react';
import renderRoles from '../renderer/renderRoles.tsx';
import NewUser from '../components/newUser.tsx';
import dayjs from 'dayjs';

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

interface UsersToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
}

const UsersToolbar = (props: UsersToolbarProps) => {
    const { rows, setRows } = props;

    const handleAddUser = (newUser: GridValidRowModel[]) => {
        newUser['id'] = Math.max(...rows.map((row) => row.id), 0) + 1;
        newUser['created_at'] = dayjs().format('YYYY-MM-DD HH:mm:ss');

        setRows((oldRows: readonly GridValidRowModel[]) => [
            ...oldRows,
            newUser,
        ]);
    };

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
                    <GridToolbarDensitySelector />
                    <GridToolbarExport />
                </Stack>
                <Stack direction={'row'} spacing={1}>
                    <NewUser handleAddUser={handleAddUser} />
                </Stack>
            </Stack>
        </GridToolbarContainer>
    );
};

const Users = () => {
    const [rows, setRows] = useState([
        {
            id: 1,
            username: 'bmontijo',
            first_name: 'Brandon',
            last_name: 'Montijo',
            created_at: '2023-11-20 09:15:00',
            updated_at: '',
            roles: [
                {
                    name: 'admin',
                },
                {
                    name: 'bid_manager',
                },
                {
                    name: 'cool guy',
                },
            ],
        },
        {
            id: 2,
            username: 'achen',
            first_name: 'Alan',
            last_name: 'Chen',
            created_at: '2023-11-21 15:30:00',
            updated_at: '',
            roles: [
                {
                    name: 'admin',
                },
            ],
        },
        {
            id: 3,
            username: 'qduong',
            first_name: 'Quynh',
            last_name: 'Duong',
            created_at: '2023-11-21 18:30:00',
            updated_at: '',
            roles: [
                {
                    name: 'admin',
                },
            ],
        },
        {
            id: 4,
            username: 'tuankiet',
            first_name: 'Kiet',
            last_name: 'Ho',
            created_at: '2023-11-21 19:30:00',
            updated_at: '',
            roles: [
                {
                    name: 'admin',
                },
            ],
        },
        {
            id: 5,
            username: 'kbagdon',
            first_name: 'Keith',
            last_name: 'Bagdon',
            created_at: '2023-11-21 21:30:00',
            updated_at: '',
            roles: [
                {
                    name: 'admin',
                },
            ],
        },
        {
            id: 6,
            username: 'msuchodolski',
            first_name: 'Marcin',
            last_name: 'Suchodolski',
            created_at: '2023-11-22 15:30:00',
            updated_at: '',
            roles: [
                {
                    name: 'bid_manager',
                },
            ],
        },
        {
            id: 7,
            username: 'ssandhu',
            first_name: 'Sophia',
            last_name: 'Sandhu',
            created_at: '2023-11-22 19:00:00',
            updated_at: '',
            roles: [
                {
                    name: 'coach',
                },
            ],
        },
    ]);

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 25]}
                slots={{
                    toolbar: UsersToolbar,
                }}
                slotProps={{
                    toolbar: { rows, setRows },
                }}
            />
        </Box>
    );
};

export default Users;
