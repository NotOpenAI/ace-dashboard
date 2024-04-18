import {
    CssBaseline,
    StyledEngineProvider,
    ThemeProvider,
    createTheme,
    useMediaQuery,
} from '@mui/material';

import { teal, grey } from '@mui/material/colors';
import { ReactNode } from 'react';

interface CustomThemeProps {
    children: ReactNode;
}

const CustomTheme = ({ children }: CustomThemeProps) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            primary: teal,
            // To change the color scheme to US Ceilings, uncomment this and remove the teal setting
            // primary: {
            //     50: '#f2d9dc',
            //     100: '#e0b3bc',
            //     200: '#cc8897',
            //     300: '#b95e72',
            //     400: '#a6334d',
            //     500: '#971b2f',
            //     600: '#820e21',
            //     700: '#6d051b',
            //     800: '#590419',
            //     900: '#3e000e',
            //     A100: '#ff819e',
            //     A200: '#ff4d7a',
            //     A400: '#ff1956',
            //     A700: '#e60042',
            // },
            secondary: grey,
            background: {
                default: prefersDarkMode ? '#151515' : '#f6f6f6',
            },
        },
    });

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default CustomTheme;
