import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';
import dayjs from 'dayjs';

const renderDate = (params: GridRenderCellParams): ReactNode => {
    const originalDate = params.value;
    if (!originalDate) return null;

    const condensedDate = dayjs(originalDate).format('YYYY/MM/DD h:mm A');

    return <>{condensedDate}</>;
};

export default renderDate;
