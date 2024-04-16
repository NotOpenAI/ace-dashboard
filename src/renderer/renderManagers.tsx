import { Button, ButtonGroup, Stack } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { NavLink as RouterLink } from 'react-router-dom';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Manager } from '../types/Role.tsx';
import { ReactNode } from 'react';

const renderManagers = (params: GridRenderCellParams): ReactNode => {
    return (
        <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={1}
            sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
            <ButtonGroup>
                {params.value.map((manager: Manager) => (
                    <Button
                        key={manager.id}
                        size={'small'}
                        startIcon={<OpenInNewIcon />}
                        color={'inherit'}
                        variant={'outlined'}
                        sx={{ textTransform: 'none' }}
                        component={RouterLink}
                        to={`/users/${manager.id}`}
                        target={'_blank'}
                    >
                        {`${manager.first_name} ${manager.last_name}`}
                    </Button>
                ))}
            </ButtonGroup>
        </Stack>
    );
};

export default renderManagers;
