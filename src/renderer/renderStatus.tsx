import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ConstructionIcon from '@mui/icons-material/Construction';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GridRenderCellParams } from '@mui/x-data-grid';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import { ReactNode } from 'react';
import * as React from 'react';

interface StatusProps {
    status: {
        id: number;
        value: string;
    };
}

const Status = React.memo((props: StatusProps) => {
    const { status } = props;

    let icon: React.ReactElement = <QuestionMarkIcon />;
    let color:
        | 'error'
        | 'info'
        | 'success'
        | 'default'
        | 'primary'
        | 'secondary'
        | 'warning' = 'default';
    let variant: 'filled' | 'outlined' = 'outlined';
    if (status.value === 'Rejected') {
        icon = <ErrorIcon className='icon' />;
        color = 'error';
    } else if (status.value === 'New') {
        icon = <InfoIcon className='icon' />;
        color = 'info';
    } else if (status.value === 'Accepted') {
        icon = <CheckCircleIcon className='icon' />;
        color = 'success';
    } else if (status.value === 'Active') {
        icon = <ConstructionIcon className='icon' />;
        color = 'info';
        variant = 'filled';
    } else if (status.value === 'Completed') {
        icon = <DoneIcon className='icon' />;
        color = 'success';
        variant = 'filled';
    }

    return (
        <Chip
            label={status.value}
            color={color}
            variant={variant}
            icon={icon}
        />
    );
});

const renderStatus = (params: GridRenderCellParams): ReactNode => {
    if (params.value == null) {
        return '';
    }

    return <Status status={params.value} />;
};

export default renderStatus;
