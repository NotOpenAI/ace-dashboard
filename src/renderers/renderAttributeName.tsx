import convertToSentenceCase from '../utils/convertToSentenceCase.tsx';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode } from 'react';

const renderAttributeName = (params: GridRenderCellParams): ReactNode => {
    return convertToSentenceCase(params.value);
};

export default renderAttributeName;
