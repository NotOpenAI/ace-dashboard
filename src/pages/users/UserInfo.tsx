import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Divider,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import ChangePasswordModal from '../../components/modal/ChangePasswordModal.tsx';
import { SelectRoles } from '../../components/select/SelectRoles.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers';
import Footer from '../../components/Footer.tsx';
import { BASE_URL } from '../../constants.tsx';
import { Role } from '../../types/Role.tsx';
import { User } from '../../types/User.tsx';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import axios from 'axios';

const UserInfo = () => {
    const { id } = useParams();

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

    const [user, setUser] = useState<User>();
    const [userRoles, setUserRoles] = useState<number[]>();
    const [roles, setRoles] = useState<Role[]>();
    const [oldUsername, setOldUsername] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (accessToken) {
            fetchUser();
            fetchRoles();
        }
    }, [accessToken]);

    const fetchUser = () => {
        axios
            .get(`${BASE_URL}/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                setUser(response.data.data);
                setUserRoles(
                    response.data.data.roles.map((role: Role) => role.id)
                );
                setOldUsername(response.data.data.username);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const fetchRoles = () => {
        axios
            .get(`${BASE_URL}/roles`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setRoles(response.data.data))
            .catch((error) => console.error(error));
    };

    const handleTextFieldChange = (key: string, value: string) => {
        setUser((prevUser: User | undefined) => {
            if (!prevUser) return prevUser;
            return {
                ...prevUser,
                [key]: value,
            };
        });
    };

    const handleRoleSelectChange = (event: {
        target: { value: SetStateAction<number[] | undefined> };
    }) => {
        const sortedRoles = Array.isArray(event.target.value)
            ? [...event.target.value].sort((a, b) => a - b)
            : undefined;
        setUserRoles(sortedRoles);
    };

    const handleSave = async () => {
        if (user?.username !== oldUsername) {
            const payload = {
                username: user?.username,
            };

            await axios
                .put(`${BASE_URL}/users/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${encodeURIComponent(
                            accessToken
                        )}`,
                    },
                })
                .then(() => {
                    enqueueSnackbar('Updated username', {
                        variant: 'success',
                    });
                    navigate('/login');
                })
                .catch((error) => {
                    enqueueSnackbar(error.response.data.detail, {
                        variant: 'error',
                    });
                    handleCancel();
                });
        }

        if (
            userRoles &&
            user?.roles.map((role) => role.id).join() !== userRoles.join()
        ) {
            const payload = {
                role_ids: userRoles,
            };

            await axios
                .put(`${BASE_URL}/users/${id}/roles`, payload, {
                    headers: {
                        Authorization: `Bearer ${encodeURIComponent(
                            accessToken
                        )}`,
                    },
                })
                .then((response) => {
                    enqueueSnackbar('Updated roles', { variant: 'success' });
                    setUser(response.data.data);
                })
                .catch((error) => {
                    enqueueSnackbar(error.response.data.detail, {
                        variant: 'error',
                    });
                    handleCancel();
                });
        }
    };

    const handleCancel = () => {
        setUser((prevUser) => {
            if (prevUser) {
                return {
                    ...prevUser,
                    username: oldUsername,
                };
            }
            return prevUser;
        });
        setUserRoles(user?.roles.map((role) => role.id));
    };

    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: 2 }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Link href={'/users'} color={'inherit'} underline={'hover'}>
                    Users
                </Link>
                <Typography color={'text.primary'}>{user?.id}</Typography>
            </Breadcrumbs>
            <Box sx={{ m: 2 }}>
                {loading ? (
                    <Box textAlign={'center'}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Container maxWidth={'md'}>
                        <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                            <Typography variant={'h6'}>User</Typography>
                            <Stack
                                direction={'column'}
                                spacing={2}
                                divider={
                                    <Divider
                                        orientation={'horizontal'}
                                        flexItem
                                    />
                                }
                                sx={{ paddingY: 2 }}
                            >
                                <Stack direction={'row'} spacing={1}>
                                    <TextField
                                        variant={'outlined'}
                                        label={'ID'}
                                        value={
                                            user?.id ? user?.id.toString() : ''
                                        }
                                        disabled
                                    />
                                    <DateTimePicker
                                        label={'Created At'}
                                        value={dayjs(user?.created_at)}
                                        sx={{ width: 500 }}
                                        readOnly
                                    />
                                    <DateTimePicker
                                        label={'Updated At'}
                                        value={
                                            user?.updated_at
                                                ? dayjs(user?.updated_at)
                                                : undefined
                                        }
                                        sx={{ width: 500 }}
                                        disabled
                                        readOnly
                                    />
                                </Stack>
                                <Stack direction={'row'} spacing={1}>
                                    <TextField
                                        variant={'outlined'}
                                        label={'First Name'}
                                        value={user?.first_name || ''}
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Last Name'}
                                        value={user?.last_name || ''}
                                        fullWidth
                                        disabled
                                    />
                                </Stack>
                                <Stack direction={'row'} spacing={1}>
                                    <TextField
                                        variant={'outlined'}
                                        label={'Username'}
                                        value={user?.username || ''}
                                        fullWidth
                                        onChange={(e) =>
                                            handleTextFieldChange(
                                                'username',
                                                e.target.value
                                            )
                                        }
                                    />
                                    {user?.id && (
                                        <ChangePasswordModal id={user?.id} />
                                    )}
                                </Stack>
                                {roles && (
                                    <Stack direction={'row'} spacing={1}>
                                        <SelectRoles
                                            options={roles}
                                            value={userRoles}
                                            onChange={handleRoleSelectChange}
                                        />
                                    </Stack>
                                )}
                            </Stack>
                            <Stack
                                direction={'row'}
                                justifyContent={'flex-end'}
                                spacing={1}
                            >
                                <Button
                                    color={'inherit'}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant={'contained'}
                                    onClick={handleSave}
                                    disabled={
                                        user?.username === oldUsername &&
                                        userRoles &&
                                        user?.roles
                                            .map((role) => role.id)
                                            .join() === userRoles.join()
                                    }
                                >
                                    Save
                                </Button>
                            </Stack>
                        </Paper>
                    </Container>
                )}
            </Box>
            <Footer />
        </>
    );
};

export default UserInfo;
