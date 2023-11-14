import * as React from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DoneIcon from "@mui/icons-material/Done";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { ReactNode } from "react";

const StyledChip = styled(Chip)(({ theme }) => ({
    justifyContent: "left",
    "& .icon": {
        color: "inherit",
    },
    "&.New": {
        color: theme.palette.info.dark,
        border: `1px solid ${theme.palette.info.main}`,
    },
    "&.Approved": {
        color: theme.palette.success.dark,
        border: `1px solid ${theme.palette.success.main}`,
    },
    "&.InProgress": {
        color: theme.palette.warning.dark,
        border: `1px solid ${theme.palette.warning.main}`,
    },
    "&.Rejected": {
        color: theme.palette.error.dark,
        border: `1px solid ${theme.palette.error.main}`,
    },
}));

interface StatusProps {
    status: string;
}

const Status = React.memo((props: StatusProps) => {
    const { status } = props;

    let icon: any = null;
    if (status === "Rejected") {
        icon = <ReportProblemIcon className='icon' />;
    } else if (status === "New") {
        icon = <InfoIcon className='icon' />;
    } else if (status === "In Progress") {
        icon = <AutorenewIcon className='icon' />;
    } else if (status === "Approved") {
        icon = <DoneIcon className='icon' />;
    }

    let label: string = status;
    if (status === "PartiallyFilled") {
        label = "Partially Filled";
    }

    return (
        <StyledChip
            className={status.replace(" ", "")}
            icon={icon}
            size='small'
            label={label}
            variant='outlined'
        />
    );
});

const renderStatus = (params: GridRenderCellParams): ReactNode => {
    if (params.value == null) {
        return "";
    }

    return <Status status={params.value} />;
};

export default renderStatus;
