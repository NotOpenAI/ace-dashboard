import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';
import Chip from '@mui/material/Chip';

const options = [
    {
        label: 'Low',
        color: 'error',
        value: '1',
    },
    {
        label: 'Medium',
        color: 'warning',
        value: '2',
    },
    {
        label: 'High',
        color: 'success',
        value: '3',
    },
];
const renderLowMediumHigh = (params: GridRenderCellParams): ReactNode => {
    if (params.value) {
        const option = options.find(
            (option) => option.value === params.value.toString()
        );

        if (option) {
            return (
                <Chip
                    size={'small'}
                    variant={'outlined'}
                    // @ts-ignore
                    color={option.color}
                    label={option.label}
                />
            );
        }
    }

    return <></>;
};

export default renderLowMediumHigh;
