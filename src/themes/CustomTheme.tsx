import {
    CssBaseline,
    StyledEngineProvider,
    ThemeProvider,
    createTheme,
} from '@mui/material';

import { ReactNode } from 'react';
import { deepPurple, lightBlue } from '@mui/material/colors';

interface CustomThemeProps {
    children: ReactNode;
}

const CustomTheme = ({ children }: CustomThemeProps) => {
    const theme = createTheme({
        palette: {
            mode: 'light',
            primary: deepPurple,
            secondary: lightBlue,
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
