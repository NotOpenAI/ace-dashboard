import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <SnackbarProvider maxSnack={5}>
            <App />
        </SnackbarProvider>
    </BrowserRouter>
);
