import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';

const renderContractType = (params: GridRenderCellParams): ReactNode => {
    return <>{params.value.name}</>;
};

export default renderContractType;
