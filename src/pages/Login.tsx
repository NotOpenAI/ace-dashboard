import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography
} from "@mui/material";


const Login = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <Container maxWidth="xs" sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100vh',
        }}>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Typography component={"h1"} variant="h5">
                    Login
                </Typography>
                <Box component={"form"} onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin={"normal"}
                        fullWidth
                        id={"username"}
                        label={"Username"}
                        name={"username"}
                        autoComplete={"username"}
                        autoFocus
                    />
                    <TextField
                        margin={"normal"}
                        fullWidth
                        name={"password"}
                        label={"Password"}
                        type={"password"}
                        id={"password"}
                        autoComplete={"current-password"}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label={"Remember me"}
                    />
                    <Button
                        fullWidth
                        variant={"contained"}
                        sx={{mt: 3, mb: 2,}}
                        href={'/bids'}
                    >
                        Login
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" sx={{textDecoration: 'none'}}>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2" sx={{textDecoration: 'none'}}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
