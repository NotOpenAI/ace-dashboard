import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const navItems = ['bids', 'customers', 'users', 'operational data', 'login'];

const MainLayout = () => {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <AppBar>
                <Toolbar variant={'dense'}>
                    <Typography
                        variant={'h6'}
                        color={'inherit'}
                        sx={{
                            flexGrow: 1,
                            display: {
                                xs: 'none',
                                sm: 'block',
                            },
                        }}
                    >
                        Dashboard
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item}
                                color={'inherit'}
                                href={item.replace(' ', '')}
                            >
                                {item}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', width: '100%', marginTop: 7 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
