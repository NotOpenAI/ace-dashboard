import { Box, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { BASE_URL } from '../constants.tsx';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
        setError(false);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setError(false);
    };

    const handleSubmit = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        axios
            .post(`${BASE_URL}/users/login`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                localStorage.setItem('accessToken', response.data.access_token);
                localStorage.setItem('username', username);
                navigate('/bids');
            })
            .catch((error) => {
                console.error(error);
                setError(true);
            })
            .finally(() => setLoading(false));
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Container
            maxWidth='xs'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component={'h1'} variant='h5'>
                    Login
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        margin={'normal'}
                        fullWidth
                        id={'username'}
                        label={'Username'}
                        name={'username'}
                        autoComplete={'username'}
                        onChange={handleUsernameChange}
                        error={error}
                        autoFocus
                    />
                    <TextField
                        margin={'normal'}
                        fullWidth
                        name={'password'}
                        label={'Password'}
                        type={'password'}
                        id={'password'}
                        autoComplete={'current-password'}
                        onChange={handlePasswordChange}
                        onKeyPress={handleKeyPress}
                        error={error}
                    />
                    <LoadingButton
                        fullWidth
                        variant={'contained'}
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Login
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
