import { GridRenderCellParams } from '@mui/x-data-grid';
import { AttributeOption } from '../types/Bid.tsx';
import Chip from '@mui/material/Chip';
import { Stack } from '@mui/material';
import { ReactNode } from 'react';

const renderAttributeOptions = (params: GridRenderCellParams): ReactNode => {
    return (
        <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={1}
            sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
            {params.value.map((option: AttributeOption) => (
                <Chip key={option.id} size={'small'} label={option.value} />
            ))}
        </Stack>
    );
};

export default renderAttributeOptions;
