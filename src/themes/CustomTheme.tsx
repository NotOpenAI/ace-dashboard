import {
    CssBaseline,
    StyledEngineProvider,
    ThemeProvider,
    createTheme,
    useMediaQuery,
} from '@mui/material';

import { ReactNode } from 'react';
import { deepPurple, teal } from '@mui/material/colors';

interface CustomThemeProps {
    children: ReactNode;
}

const CustomTheme = ({ children }: CustomThemeProps) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = createTheme({
        palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            primary: teal,
            secondary: deepPurple,
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
