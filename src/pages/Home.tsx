import { Breadcrumbs, LinearProgress, Paper, Typography } from '@mui/material';
import { BASE_URL, PAGE_COLUMNS, SPACING } from '../constants.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BarChart, LineChart } from '@mui/x-charts';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bid } from '../types/Bid.tsx';
import { Masonry } from '@mui/lab';
import axios from 'axios';

export const Home = () => {
    const [accessToken, setAccessToken] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const sessionExpiration = localStorage.getItem('sessionExpiration');

        if (sessionExpiration) {
            if (parseInt(sessionExpiration) - new Date().getTime() < 0) {
                navigate('/login');
            }
        }

        if (token) {
            setAccessToken(token);
        } else {
            navigate('/login');
        }
    }, []);

    const [loading, setLoading] = useState(true);
    const [bids, setBids] = useState<Bid[]>([]);

    useEffect(() => {
        if (accessToken) {
            fetchData();
        }
    }, [accessToken]);

    const fetchData = () => {
        axios
            .get(`${BASE_URL}/bids`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => setBids(response.data.data))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: 2 }}
            >
                <Typography color={'text.primary'}>Home</Typography>
            </Breadcrumbs>
            {loading ? (
                <LinearProgress />
            ) : (
                <Masonry columns={PAGE_COLUMNS} spacing={SPACING}>
                    <Paper elevation={1} sx={{ borderRadius: 2, p: 2 }}>
                        <Typography variant={'h6'}>Revenue</Typography>
                        <LineChart
                            height={300}
                            series={[
                                {
                                    data: bids.map(
                                        (bid) => bid.original_contract
                                    ),
                                    label: 'Original Contract Amount',
                                },
                            ]}
                            xAxis={[
                                {
                                    scaleType: 'point',
                                    data: bids.map(
                                        (project) => project.customer.name
                                    ),
                                },
                            ]}
                        />
                    </Paper>
                    <Paper elevation={1} sx={{ borderRadius: 2, p: 2 }}>
                        <Typography variant={'h6'}>
                            Top Contracted Customers
                        </Typography>
                        <BarChart
                            height={300}
                            xAxis={[
                                {
                                    scaleType: 'band',
                                    data: bids.map(
                                        (project) => project.customer.name
                                    ),
                                },
                            ]}
                            series={[
                                {
                                    data: bids.map(
                                        (bid) => bid.original_contract
                                    ),
                                    label: 'Original Contract Amount',
                                },
                            ]}
                        />
                    </Paper>
                </Masonry>
            )}
        </>
    );
};
