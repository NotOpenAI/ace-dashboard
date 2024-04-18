import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';

const renderPercentage = (params: GridRenderCellParams): ReactNode => {
    const value = parseFloat(params.value);
    if (isNaN(value)) return null;

    const formattedPercentage = `${(value * 100).toFixed(2)}%`;

    return <>{formattedPercentage}</>;
};

export default renderPercentage;
