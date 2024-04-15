import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Outlet, useLocation, NavLink as RouterLink } from 'react-router-dom';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import { capitalizeEachWord } from '../utils/capitalizeEachWord.tsx';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ListItemButton from '@mui/material/ListItemButton';
import AccountMenu from '../components/AccountMenu.tsx';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { SPACING } from '../constants.tsx';
import { Container } from '@mui/material';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import * as React from 'react';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

const navItems = ['', 'bids', 'customers', 'users'];

const MainLayout = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const location = useLocation();
    const [activePage, setActivePage] = React.useState('');

    useEffect(() => {
        const pathname = location.pathname.substring(1).replace('-', ' ');
        setActivePage(pathname);
    }, [location.pathname]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position='fixed' open={open} enableColorOnDark>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color='inherit'
                            aria-label='open drawer'
                            onClick={handleDrawerOpen}
                            edge='start'
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h6' noWrap component='div'>
                            Ace Dashboard
                        </Typography>
                    </Box>
                    <AccountMenu />
                </Toolbar>
            </AppBar>
            <Drawer variant='permanent' open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? (
                            <ChevronRightIcon />
                        ) : (
                            <ChevronLeftIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {navItems.map((text) => (
                        <ListItem
                            key={text}
                            disablePadding
                            sx={{ display: 'block' }}
                        >
                            <ListItemButton
                                component={RouterLink}
                                to={text.replace(' ', '-')}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    borderRadius: 4,
                                    m: 1,
                                    backgroundColor:
                                        activePage === text.toLowerCase()
                                            ? theme.palette.action.selected
                                            : 'transparent',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {text === '' && <HomeRoundedIcon />}
                                    {text === 'bids' && <ViewListRoundedIcon />}
                                    {text === 'projects' && (
                                        <AssignmentRoundedIcon />
                                    )}
                                    {text === 'customers' && <PeopleIcon />}
                                    {text === 'users' && <ManageAccountsIcon />}
                                    {text === 'operational data' && (
                                        <DataThresholdingIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={capitalizeEachWord(text || 'Home')}
                                    sx={{ opacity: open ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem
                        key={'account'}
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            component={RouterLink}
                            to={'account'}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                                borderRadius: 4,
                                m: 1,
                                backgroundColor:
                                    activePage === 'account'
                                        ? theme.palette.action.selected
                                        : 'transparent',
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={'Account'}
                                sx={{ opacity: open ? 1 : 0 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Container
                component={'main'}
                maxWidth={'xl'}
                sx={{ marginTop: 10, p: SPACING - 1 }}
            >
                <Outlet />
            </Container>
        </Box>
    );
};

export default MainLayout;
