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
import { useNavigate } from 'react-router-dom';
import { Comment } from '../../types/Bid.tsx';
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
    handleAddComment: (comment: Comment) => void;
};

const RecommendedActionModal = ({
    id,
    name,
    desiredMargin,
    handleSetBidStatus,
    handleAddComment,
}: ChangePasswordProps) => {
    const [accessToken, setAccessToken] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const sessionExpiration = localStorage.getItem('sessionExpiration');

        if (sessionExpiration) {
            if (parseInt(sessionExpiration) - new Date().getTime() < 0) {
                navigate('/login');
            }
        }

        if (token) {
            setAccessToken(token);
        } else {
            navigate('/login');
        }
    }, []);

    const [open, setOpen] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>();
    const [selectedOption, setSelectedOption] = useState<'success' | 'error'>();
    const [estimatedMargin, setEstimatedMargin] = useState<number>(0);
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);

    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => {
        setOpen(false);
        setShowComments(false);
    };

    const handleOpen = () => {
        setOpen(true);

        axios
            .get(`${BASE_URL}/ai/${id}`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setEstimatedMargin(
                    Math.round(parseFloat(response.data.data) * 10000) / 100
                );
            })
            .catch((error) => {
                setError('Not enough data');
                enqueueSnackbar(error.response.data.detail, {
                    variant: 'error',
                });
            })
            .finally(() => setLoading(false));
    };

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
        if (commentText) {
            handleAddComment({ text: commentText });
        }
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
                                            : estimatedMargin === desiredMargin
                                              ? 'info'
                                              : estimatedMargin <
                                                      desiredMargin && !error
                                                ? 'error'
                                                : 'default'
                                    }
                                    variant={
                                        estimatedMargin === desiredMargin
                                            ? 'outlined'
                                            : 'filled'
                                    }
                                    icon={<ErrorIcon />}
                                    label={"Don't Bid"}
                                />
                                <Chip
                                    color={
                                        loading
                                            ? 'default'
                                            : estimatedMargin === desiredMargin
                                              ? 'info'
                                              : estimatedMargin > desiredMargin
                                                ? 'success'
                                                : 'default'
                                    }
                                    variant={
                                        estimatedMargin === desiredMargin
                                            ? 'outlined'
                                            : 'filled'
                                    }
                                    icon={<CheckIcon />}
                                    label={'Bid'}
                                />
                            </Stack>
                        </Stack>
                        <Stack direction={'column'} spacing={1}>
                            <Typography variant={'body1'}>
                                Desired Margin:{' '}
                                <strong>
                                    {desiredMargin
                                        ? `${desiredMargin}%`
                                        : 'Not set'}
                                </strong>
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
                                        value={desiredMargin || 0}
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
                                                : !desiredMargin
                                                  ? 'info'
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
                                        <strong>
                                            {error
                                                ? error
                                                : `${estimatedMargin}%`}
                                        </strong>
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
                                <TextField
                                    multiline
                                    value={commentText}
                                    onChange={(event) => {
                                        setCommentText(event.target.value);
                                    }}
                                    rows={3}
                                />
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
