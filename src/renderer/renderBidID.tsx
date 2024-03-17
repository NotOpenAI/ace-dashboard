import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const renderBidType = (params: GridRenderCellParams): ReactNode => {
    return (
        <Button
            size={'small'}
            component={Link}
            to={`/bids/${params.value}`}
            sx={{ borderRadius: 12 }}
        >
            {params.value}
        </Button>
    );
};

export default renderBidType;
