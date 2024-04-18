import { GridRenderCellParams } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { memo, ReactNode } from 'react';
import Chip from '@mui/material/Chip';
import { Stack } from '@mui/material';

const StyledChip = styled(Chip)(({ theme }) => ({
    justifyContent: 'left',
    '&.admin': {
        color: theme.palette.info.contrastText,
        backgroundColor: theme.palette.info.main,
    },
    '&.bid_manager': {
        color: theme.palette.success.contrastText,
        backgroundColor: theme.palette.success.main,
    },
}));

interface RoleProps {
    role: string;
}

const Role = memo((props: RoleProps) => {
    const { role } = props;

    let label: string = '';
    if (role === 'bid_manager') {
        label = 'Bid Manager';
    } else if (role === 'admin') {
        label = 'Administrator';
    } else {
        label = role.charAt(0).toUpperCase() + role.slice(1);
    }

    return (
        <StyledChip
            className={role}
            size={'small'}
            label={label}
            variant={'filled'}
        />
    );
});

interface Role {
    name: string;
}

const renderRoles = (params: GridRenderCellParams): ReactNode => {
    if (params.value == null) {
        return '';
    }

    return (
        <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={1}
            sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
            {params.value.map((role: Role) => (
                <Role key={role.name} role={role.name} />
            ))}
        </Stack>
    );
};

export default renderRoles;
