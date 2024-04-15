import { NavLink as RouterLink } from 'react-router-dom';
import { GridRenderCellParams } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import { Button, Stack } from '@mui/material';
import { ReactNode } from 'react';

const renderCustomer = (params: GridRenderCellParams): ReactNode => {
    return (
        <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={2}
        >
            <Button
                size={'small'}
                startIcon={<InfoIcon />}
                color={'inherit'}
                variant={'outlined'}
                sx={{ borderRadius: 4, textTransform: 'none' }}
                component={RouterLink}
                to={`/customers/${params.value.id}`}
            >
                {params.value.name}
            </Button>
        </Stack>
    );
};

export default renderCustomer;
