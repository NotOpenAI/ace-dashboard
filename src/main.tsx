import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SnackbarProvider maxSnack={5}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SnackbarProvider>
    </StrictMode>
);
