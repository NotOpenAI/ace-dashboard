import Router from './routes/Router';
import CustomTheme from './themes/CustomTheme';
import ScrollTop from './components/ScrollTop.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const App = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CustomTheme>
                <ScrollTop>
                    <Router />
                </ScrollTop>
            </CustomTheme>
        </LocalizationProvider>
    );
};

export default App;
