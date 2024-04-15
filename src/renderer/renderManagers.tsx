import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { capitalizeEachWord } from '../utils/capitalizeEachWord.tsx';
import { GridRenderCellParams } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import { ReactNode, useState } from 'react';
import dayjs from 'dayjs';

interface Manager {
    username: string;
    first_name: string;
    last_name: string;
    id: number;
    created_at: string;
    updated_at: string;
}

const ProjectManager = (manager: Manager): ReactNode => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={2}
        >
            <Button
                onClick={handleOpen}
                size={'small'}
                startIcon={<InfoIcon />}
                color={'inherit'}
                variant={'outlined'}
                sx={{ borderRadius: 4, textTransform: 'none' }}
            >
                {`${manager.first_name} ${manager.last_name}`}
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Typography
                        variant={'h6'}
                        component={'h2'}
                        paddingBottom={2}
                    >
                        Manager
                    </Typography>
                    <Stack spacing={1}>
                        {Object.entries(manager).map(([key, value]) => (
                            <Typography key={key}>
                                <strong>
                                    {capitalizeEachWord(key.replace('_', ' '))}:
                                </strong>{' '}
                                {key.includes('ed_at') && value !== null
                                    ? dayjs(value).format('YYYY/MM/DD h:mm A')
                                    : value}
                            </Typography>
                        ))}
                    </Stack>
                </Box>
            </Modal>
        </Stack>
    );
};

const renderManagers = (params: GridRenderCellParams): ReactNode => {
    return (
        <Stack
            direction={'row'}
            spacing={1}
            sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
            {params.value.map((manager: Manager) => (
                <ProjectManager
                    key={manager.id}
                    username={manager.username}
                    first_name={manager.first_name}
                    last_name={manager.last_name}
                    id={manager.id}
                    created_at={manager.created_at}
                    updated_at={manager.updated_at}
                />
            ))}
        </Stack>
    );
};

export default renderManagers;
