import { CustomerInfo } from '../pages/customers/CustomerInfo.tsx';
import { NewCustomer } from '../pages/customers/NewCustomer.tsx';
import Customers from '../pages/customers/Customers.tsx';
import UserInfo from '../pages/users/UserInfo.tsx';
import { NewBid } from '../pages/bids/NewBid.tsx';
import NewUser from '../pages/users/NewUser.tsx';
import { BidV3 } from '../pages/bids/BidV3.tsx';
import MainLayout from '../layouts/MainLayout';
import { Bids } from '../pages/bids/Bids.tsx';
import Users from '../pages/users/Users.tsx';
import { useRoutes } from 'react-router-dom';
import { Home } from '../pages/Home.tsx';
import Login from '../pages/Login';

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
                    element: <BidV3 />,
                },
                {
                    path: 'users',
                    element: <Users />,
                },
                {
                    path: 'users/:id',
                    element: <UserInfo />,
                },
                {
                    path: 'users/new',
                    element: <NewUser />,
                },
                {
                    path: 'customers',
                    element: <Customers />,
                },
                {
                    path: 'customers/:id',
                    element: <CustomerInfo />,
                },
                {
                    path: 'customers/new',
                    element: <NewCustomer />,
                },
                {
                    path: 'account',
                    element: <UserInfo />,
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
