import {
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Divider,
    InputAdornment,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { SelectRoles } from '../../components/select/SelectRoles.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SetStateAction, useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Footer from '../../components/Footer.tsx';
import { BASE_URL } from '../../constants.tsx';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../types/Role.tsx';
import { User } from '../../types/User.tsx';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const NewUser = () => {
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

    const [user, setUser] = useState<User>({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        roles: [],
    });
    const [userRoles, setUserRoles] = useState<number[]>([]);
    const [roles, setRoles] = useState<Role[]>();
    const [loading, setLoading] = useState(false);
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (accessToken) {
            fetchRoles();
        }
    }, [accessToken]);

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
        // @ts-ignore
        setUser((prevUser: User) => ({
            ...prevUser,
            [key]: value,
        }));
    };

    const handleRoleSelectChange = (event: {
        target: { value: SetStateAction<number[] | undefined> };
    }) => {
        const sortedRoles = Array.isArray(event.target.value)
            ? [...event.target.value].sort((a, b) => a - b)
            : undefined;
        if (sortedRoles) {
            setUserRoles(sortedRoles);
        }
    };

    const handleCreateUser = async () => {
        setLoading(true);
        const payload = {
            ...user,
            role_ids: userRoles,
        };

        try {
            await axios.post(`${BASE_URL}/users`, payload, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            });
            enqueueSnackbar('User created successfully!', {
                variant: 'success',
            });
            navigate('/users');
        } catch (error) {
            // @ts-ignore
            enqueueSnackbar(error.response.data.detail, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: { preventDefault: () => void }) => {
        event.preventDefault();
    };

    useEffect(() => {
        const areAllFieldsFilled =
            Object.values(user).every((value) => value !== '') &&
            userRoles.length > 0 &&
            roles &&
            roles.length > 0;
        if (areAllFieldsFilled) {
            setAllFieldsFilled(areAllFieldsFilled);
        }
    }, [user, userRoles, roles]);

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
                <Typography color={'text.primary'}>New</Typography>
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
                                        label={'First Name'}
                                        value={user.first_name}
                                        fullWidth
                                        onChange={(e) =>
                                            handleTextFieldChange(
                                                'first_name',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Last Name'}
                                        value={user.last_name}
                                        fullWidth
                                        onChange={(e) =>
                                            handleTextFieldChange(
                                                'last_name',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </Stack>
                                <Stack direction={'row'} spacing={1}>
                                    <TextField
                                        variant={'outlined'}
                                        label={'Username'}
                                        value={user.username}
                                        fullWidth
                                        onChange={(e) =>
                                            handleTextFieldChange(
                                                'username',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <FormControl
                                        variant={'outlined'}
                                        required
                                        fullWidth
                                    >
                                        <InputLabel>Password</InputLabel>
                                        <OutlinedInput
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            endAdornment={
                                                <InputAdornment
                                                    position={'end'}
                                                >
                                                    <IconButton
                                                        onClick={
                                                            handleClickShowPassword
                                                        }
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
                                            label={'Password'}
                                            value={user.password}
                                            onChange={(e) =>
                                                handleTextFieldChange(
                                                    'password',
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                            required
                                        />
                                    </FormControl>
                                </Stack>
                                {roles && (
                                    <Stack direction={'row'} spacing={1}>
                                        <SelectRoles
                                            options={roles}
                                            value={userRoles}
                                            onChange={handleRoleSelectChange}
                                            required
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
                                    onClick={() => navigate('/users')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant={'contained'}
                                    onClick={handleCreateUser}
                                    disabled={!allFieldsFilled || loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        'Create'
                                    )}
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

export default NewUser;
