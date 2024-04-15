import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { ReactNode } from 'react';

const renderCustomerID = (params: GridRenderCellParams): ReactNode => {
    return (
        <Button
            size={'small'}
            component={Link}
            to={`/customers/${params.value}`}
            sx={{ borderRadius: 12 }}
        >
            {params.value}
        </Button>
    );
};

export default renderCustomerID;
