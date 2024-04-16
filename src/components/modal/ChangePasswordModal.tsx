import {
    Box,
    Button,
    Modal,
    Typography,
    Stack,
    InputAdornment,
    Checkbox,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import { BASE_URL } from '../../constants.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

type ChangePasswordProps = {
    id: number;
};

const ChangePasswordModal = ({ id }: ChangePasswordProps) => {
    const [accessToken, setAccessToken] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            navigate('/login');
        }
    }, []);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
    };

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
        event.preventDefault();
    };

    const handleUpdate = () => {
        setLoading(true);

        const payload = {
            password: password,
        };

        axios
            .put(`${BASE_URL}/users/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setOpen(false);
                setLoading(false);
            });
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                variant={'outlined'}
                sx={{ width: '50%' }}
            >
                Change Password
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        width: 400,
                        p: 4,
                    }}
                >
                    <Typography
                        variant={'h6'}
                        fontWeight={'light'}
                        textAlign={'center'}
                    >
                        Change Password
                    </Typography>
                    <Stack direction={'column'} spacing={1} paddingY={3}>
                        <FormControl variant={'outlined'}>
                            <InputLabel>New Password</InputLabel>
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position={'end'}>
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            edge={'end'}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={'NewUser Password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            spacing={1}
                        >
                            <Checkbox
                                color={'success'}
                                size={'small'}
                                checked={password.length > 6}
                                disabled
                            />
                            <Typography variant={'body2'}>
                                Minimum 7 characters
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-end'}
                        spacing={1}
                    >
                        <Button
                            variant={'text'}
                            color={'inherit'}
                            sx={{ marginTop: 1 }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={'contained'}
                            sx={{ marginTop: 1 }}
                            disabled={password.length < 7}
                            onClick={handleUpdate}
                        >
                            Update
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Backdrop
                open={loading}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <CircularProgress color={'inherit'} />
            </Backdrop>
        </>
    );
};

export default ChangePasswordModal;
