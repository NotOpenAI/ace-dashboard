import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ScrollTop from './components/ScrollTop.tsx';
import CustomTheme from './themes/CustomTheme';
import Router from './routes/Router';

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
