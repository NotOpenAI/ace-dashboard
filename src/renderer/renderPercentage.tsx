import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';

const renderPercentage = (params: GridRenderCellParams): ReactNode => {
    const value = parseFloat(params.value);
    if (isNaN(value)) return null;

    const percentage = value / 100;
    const formattedValue = percentage.toLocaleString('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });

    return <>{formattedValue}</>;
};

export default renderPercentage;
