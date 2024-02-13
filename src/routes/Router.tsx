import { useRoutes } from 'react-router-dom';
import Bids from '../pages/Bids';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import Users from '../pages/Users.tsx';
import Customers from '../pages/Customers.tsx';
import OperationalData from '../pages/OperationalData.tsx';
import { Account } from '../pages/Account.tsx';
import { Bid } from '../pages/Bid.tsx';
import { Home } from '../pages/Home.tsx';
import Projects from '../pages/Projects.tsx';
import { NewBid } from '../pages/NewBid.tsx';

const Router = () => {
    return useRoutes([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    path: '',
                    element: <Home />,
                },
                {
                    path: 'bids',
                    element: <Bids />,
                },
                {
                    path: 'bids/new',
                    element: <NewBid />,
                },
                {
                    path: 'bids/:id',
                    element: <Bid />,
                },
                {
                    path: 'projects',
                    element: <Projects />,
                },
                {
                    path: 'users',
                    element: <Users />,
                },
                {
                    path: 'customers',
                    element: <Customers />,
                },
                {
                    path: 'operational-data',
                    element: <OperationalData />,
                },
                {
                    path: 'account',
                    element: <Account />,
                },
            ],
        },
        {
            path: '/login',
            element: <Login />,
        },
    ]);
};

export default Router;
