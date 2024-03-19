import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { ReactNode, useState } from 'react';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import { capitalizeEachWord } from '../utils/capitalizeEachWord.tsx';
import InfoIcon from '@mui/icons-material/Info';

const renderBidManager = (params: GridRenderCellParams): ReactNode => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                {params.value.first_name} {params.value.last_name}
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
                        Bid Manager
                    </Typography>
                    <DataGrid
                        density={'compact'}
                        columns={Object.keys(params.value).map((key) => ({
                            field: key,
                            headerName: capitalizeEachWord(
                                key.replace('_', ' ')
                            ),
                            sortable: false,
                        }))}
                        rows={[params.value]}
                        hideFooter
                        autoHeight
                        disableRowSelectionOnClick
                        disableColumnMenu
                        disableColumnFilter
                    />
                </Box>
            </Modal>
        </Stack>
    );
};

export default renderBidManager;
