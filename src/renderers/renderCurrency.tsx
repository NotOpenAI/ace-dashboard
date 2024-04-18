import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';

const renderCurrency = (params: GridRenderCellParams): ReactNode => {
    const value = parseFloat(params.value);
    if (isNaN(value)) return null;

    const formattedValue = value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return <>{formattedValue}</>;
};

export default renderCurrency;
