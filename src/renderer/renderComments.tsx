import { Box, Button, Modal, Stack } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import { ReactNode, useState } from 'react';

const renderComments = (params: GridRenderCellParams): ReactNode => {
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
                Comments
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
                    {params.value}
                </Box>
            </Modal>
        </Stack>
    );
};

export default renderComments;
