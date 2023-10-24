import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import PendingIcon from '@mui/icons-material/Pending';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import {GridRenderCellParams} from "@mui/x-data-grid";
import {ReactNode} from "react";

const StyledChip = styled(Chip)(({ theme }) => ({
    justifyContent: 'left',
    '& .icon': {
        color: 'inherit',
    },
    '&.Pending': {
        color: theme.palette.secondary.dark,
        border: `1px solid ${theme.palette.info.main}`,
    },
    '&.Bid': {
        color: theme.palette.success.dark,
        border: `1px solid ${theme.palette.success.main}`,
    },
    '&.PartiallyFilled': {
        color: theme.palette.warning.dark,
        border: `1px solid ${theme.palette.warning.main}`,
    },
    '&.NoBid': {
        color: theme.palette.error.dark,
        border: `1px solid ${theme.palette.error.main}`,
    },
}));

interface StatusProps {
    recommendedAction: string;
}

const RecommendedAction = React.memo((props: StatusProps) => {
    const { recommendedAction } = props;

    let icon: any = null;
    if (recommendedAction === 'Bid') {
        icon = <CheckIcon className="icon" />;
    } else if (recommendedAction === 'No Bid') {
        icon = <DoNotDisturbIcon className="icon" />;
    } else if (recommendedAction === 'Review') {
        icon = <SearchIcon className="icon" />;
    } else if (recommendedAction === 'Pending') {
        icon = <PendingIcon className="icon" />;
    }

    let label: string = recommendedAction;
    if (recommendedAction === 'PartiallyFilled') {
        label = 'Partially Filled';
    }

    return (
        <StyledChip className={recommendedAction.replace(' ', '')} icon={icon} size="small" label={label} variant="outlined" />
    );
});

const renderRecommendedAction = (params: GridRenderCellParams): ReactNode => {
    if (params.value == null) {
        return '';
    }

    return <RecommendedAction recommendedAction={params.value} />;
}

export default renderRecommendedAction;
