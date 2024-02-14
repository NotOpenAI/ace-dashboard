import { Paper, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { SPACING } from '../constants.tsx';
import { Masonry } from '@mui/lab';

const uData = [0, 1500, 2000, 2780, 4500, 8000];
const pData = [0, 600, 800, 5000, 5200, 9000];
const bData = [0, 4500, 10000, 50000, 193000, 240000];
const xLabels = ['January', 'February', 'March', 'April', 'May', 'June'];

export const Home = () => {
    return (
        <>
            <Typography variant={'h4'}>Home</Typography>
            <Masonry columns={2} spacing={SPACING}>
                <Paper elevation={1} sx={{ borderRadius: 2, p: 2 }}>
                    <Typography variant={'h6'}>Top Managers</Typography>
                    <LineChart
                        height={300}
                        series={[
                            { data: pData, label: 'Marcin Suchodolski' },
                            { data: uData, label: 'Brandon Montijo' },
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                    />
                </Paper>
                <Paper elevation={1} sx={{ borderRadius: 2, p: 2 }}>
                    <Typography variant={'h6'}>Revenue</Typography>
                    <LineChart
                        height={300}
                        series={[{ data: bData, label: 'Total Bid Revenue' }]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                    />
                </Paper>
            </Masonry>
        </>
    );
};
