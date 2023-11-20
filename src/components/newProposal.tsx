import { SyntheticEvent, useState } from 'react';
import { Box, Button, Modal, Tab, Tabs, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import CustomStepper from './customStepper.tsx';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const NewProposal = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [bidDueDate, setBidDueDate] = useState<Dayjs | null>();

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Button
                variant={'contained'}
                onClick={handleOpen}
                color={'primary'}
                startIcon={<AddIcon />}
                size={'small'}
            >
                v2
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        width: 600,
                        p: 4,
                    }}
                >
                    <Typography
                        variant={'h4'}
                        textAlign={'center'}
                        fontWeight={'light'}
                        paddingBottom={4}
                    >
                        New Proposal
                    </Typography>
                    <CustomStepper />
                </Box>
            </Modal>
        </LocalizationProvider>
    );
};

export default NewProposal;
