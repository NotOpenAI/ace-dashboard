import {
    Button,
    LinearProgress,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { BASE_URL } from '../../constants.tsx';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Chip from '@mui/material/Chip';
import axios from 'axios';

type ChangePasswordProps = {
    id: number;
    name: string;
    desiredMargin: number;
    handleSetBidStatus: (option: 'Accepted' | 'Rejected') => void;
};

const RecommendedActionModal = ({
    id,
    name,
    desiredMargin,
    handleSetBidStatus,
}: ChangePasswordProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<'success' | 'error'>();

    const { enqueueSnackbar } = useSnackbar();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const [loading, setLoading] = useState<boolean>(true);
    const [estimatedMargin, setEstimatedMargin] = useState<number>(0);

    useEffect(() => {
        // axios
        //     .get(`${BASE_URL}/ai/${id}`)
        //     .then((response) => {
        //         console.log(response.data.data);
        //         setEstimatedMargin(response.data.data);
        //     })
        //     .catch((error) =>
        //         enqueueSnackbar(error.response.data, { variant: 'error' })
        //     );

        const timeoutId = setTimeout(() => {
            setLoading(false);
            setEstimatedMargin(Math.floor(Math.random() * 100) + 1);
        }, 2500);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleReject = () => {
        setShowComments(true);
        setSelectedOption('error');
    };

    const handleAccept = () => {
        setShowComments(true);
        setSelectedOption('success');
    };

    const handleConfirm = () => {
        let action: 'Accepted' | 'Rejected' = 'Accepted';
        if (selectedOption === 'success') {
            action = 'Accepted';
        } else if (selectedOption === 'error') {
            action = 'Rejected';
        }
        handleSetBidStatus(action);
        handleClose();
        enqueueSnackbar(
            `Bid ${action} - confirm changes by clicking the save button`,
            { variant: 'info' }
        );
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                color={'secondary'}
                variant={'outlined'}
                startIcon={<DeveloperBoardIcon />}
            >
                AI Recommendation
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Paper
                    elevation={1}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: 4,
                        width: 450,
                        p: 2,
                    }}
                >
                    <Stack direction={'column'} spacing={3}>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            alignItems={'flex-start'}
                        >
                            <Typography variant={'h6'} fontWeight={'light'}>
                                <strong>{name}</strong>
                            </Typography>
                            <IconButton
                                onClick={handleClose}
                                sx={{ borderRadius: 2 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            AI Recommendation
                            <Stack direction={'row'} spacing={1}>
                                <Chip
                                    color={
                                        loading
                                            ? 'default'
                                            : estimatedMargin < desiredMargin
                                              ? 'error'
                                              : 'default'
                                    }
                                    icon={<ErrorIcon />}
                                    label={"Don't Bid"}
                                />
                                <Chip
                                    color={
                                        loading
                                            ? 'default'
                                            : estimatedMargin >= desiredMargin
                                              ? 'success'
                                              : 'default'
                                    }
                                    icon={<CheckIcon />}
                                    label={'Bid'}
                                />
                            </Stack>
                        </Stack>
                        <Stack direction={'column'} spacing={1}>
                            <Typography variant={'body1'}>
                                Desired Margin:{' '}
                                <strong>{desiredMargin}%</strong>
                            </Typography>
                            <Stack direction={'column'}>
                                <Tooltip
                                    title={'Desired Margin'}
                                    placement={'top'}
                                    arrow
                                >
                                    <LinearProgress
                                        color={'secondary'}
                                        variant={'determinate'}
                                        sx={{
                                            height: 10,
                                            borderRadius: '4px 4px 0 0',
                                        }}
                                        value={desiredMargin}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title={'AI Estimated Margin'}
                                    placement={'bottom'}
                                    arrow
                                >
                                    <LinearProgress
                                        color={
                                            loading
                                                ? 'secondary'
                                                : estimatedMargin >=
                                                    desiredMargin
                                                  ? 'success'
                                                  : 'error'
                                        }
                                        variant={
                                            loading
                                                ? 'indeterminate'
                                                : 'determinate'
                                        }
                                        sx={{
                                            height: 10,
                                            borderRadius: '0 0 4px 4px',
                                        }}
                                        value={estimatedMargin}
                                    />
                                </Tooltip>
                            </Stack>
                            <Typography variant={'body1'}>
                                AI Estimated Margin:{' '}
                                {!loading && (
                                    <>
                                        <strong>{estimatedMargin}%</strong>
                                    </>
                                )}
                            </Typography>
                        </Stack>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <Button color={'error'} onClick={handleReject}>
                                Reject
                            </Button>
                            <Button color={'success'} onClick={handleAccept}>
                                Accept
                            </Button>
                        </Stack>
                        {showComments && (
                            <Stack direction={'column'} spacing={1}>
                                <Typography variant={'h6'}>Comments</Typography>
                                <TextField multiline rows={3} />
                                <Button
                                    color={selectedOption}
                                    variant={'contained'}
                                    onClick={handleConfirm}
                                    fullWidth
                                >
                                    Confirm
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            </Modal>
        </>
    );
};

export default RecommendedActionModal;
