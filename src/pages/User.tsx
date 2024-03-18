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
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants.tsx';
import { DateTimePicker } from '@mui/x-date-pickers';
import * as dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import InfoIcon from '@mui/icons-material/Info';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Footer from '../components/Footer.tsx';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
}

export const User = () => {
    const [user, setUser] = useState<User>();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = () => {
        axios
            .get(`${BASE_URL}/users/bmontijo`) // TODO - replace with userID
            .then((response) => {
                setUser(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
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
                            <Typography variant={'h6'}>General</Typography>
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
                                        defaultValue={user?.id}
                                        disabled
                                    />
                                    <DateTimePicker
                                        label={'Created At'}
                                        defaultValue={dayjs(user?.created_at)}
                                        sx={{ width: 500 }}
                                        readOnly
                                    />
                                    <DateTimePicker
                                        label={'Updated At'}
                                        defaultValue={dayjs(
                                            user?.updated_at || user?.created_at
                                        )}
                                        sx={{ width: 500 }}
                                        readOnly
                                    />
                                </Stack>
                                <TextField
                                    variant={'outlined'}
                                    label={'Username'}
                                    defaultValue={user?.username}
                                    fullWidth
                                />
                                <Stack direction={'row'} spacing={1}>
                                    <TextField
                                        variant={'outlined'}
                                        label={'First Name'}
                                        defaultValue={user?.first_name}
                                        fullWidth
                                    />
                                    <TextField
                                        variant={'outlined'}
                                        label={'Last Name'}
                                        defaultValue={user?.last_name}
                                        fullWidth
                                    />
                                </Stack>
                            </Stack>
                            <Stack
                                direction={'row'}
                                justifyContent={'flex-end'}
                                spacing={1}
                            >
                                <Button color={'inherit'}>Cancel</Button>
                                <Button variant={'contained'}>Save</Button>
                            </Stack>
                            <Typography variant={'h6'}>Roles</Typography>
                            <Stack
                                direction={'row'}
                                spacing={1}
                                sx={{ paddingTop: 2 }}
                            >
                                {user?.roles.map((role) => (
                                    <Chip
                                        key={role.id}
                                        icon={<InfoIcon />}
                                        // variant={'outlined'}
                                        sx={{
                                            borderRadius: 4,
                                            textTransform: 'none',
                                        }}
                                        label={role.name}
                                    />
                                ))}
                                <Button
                                    // variant={'contained'}
                                    color={'primary'}
                                    startIcon={<AddRoundedIcon />}
                                    size={'small'}
                                    sx={{ borderRadius: 4 }}
                                >
                                    Add
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
