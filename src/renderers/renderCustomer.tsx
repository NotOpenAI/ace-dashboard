import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NavLink as RouterLink } from 'react-router-dom';
import { GridRenderCellParams } from '@mui/x-data-grid';
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
                startIcon={<OpenInNewIcon />}
                color={'inherit'}
                variant={'outlined'}
                sx={{ textTransform: 'none' }}
                component={RouterLink}
                to={`/customers/${params.value.id}`}
                target={'_blank'}
            >
                {params.value.name}
            </Button>
        </Stack>
    );
};

export default renderCustomer;
