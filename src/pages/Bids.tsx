import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import renderStatus from '../renderer/renderStatus.tsx';
import renderRecommendedAction from '../renderer/renderRecommendedAction.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const columns: GridColDef[] = [
    { field: 'projectNo', headerName: 'Project No', width: 120 },
    {
        field: 'status',
        headerName: 'Status',
        renderCell: renderStatus,
        width: 120,
    },
    {
        field: 'recommendedAction',
        headerName: 'Recommended Action',
        renderCell: renderRecommendedAction,
        width: 160,
    },
    { field: 'jobName', headerName: 'Job Name', width: 160 },
    { field: 'bidDueDate', headerName: 'Bid Due Date', width: 150 },
    { field: 'jobStartDate', headerName: 'Job Start Date', width: 150 },
    { field: 'jobEndDate', headerName: 'Job End Date', width: 150 },
    { field: 'leadFrom', headerName: 'Lead From', width: 160 },
    { field: 'bidMgr', headerName: 'Bid Mgr', width: 120 },
    {
        field: 'customerContactInfo',
        headerName: 'Customer Contact Info',
        width: 200,
    },
    { field: 'customerName', headerName: 'Customer Name', width: 160 },
    {
        field: 'jobLocationAddress',
        headerName: 'Job Location Address',
        width: 200,
    },
    {
        field: 'estimatedTotalCost',
        headerName: 'Estimated Total Cost',
        width: 150,
    },
    {
        field: 'estimatedMaterialCost',
        headerName: 'Estimated Material Cost',
        width: 150,
    },
    {
        field: 'estimatedLaborCost',
        headerName: 'Estimated Labor Cost',
        width: 150,
    },
    { field: 'bidAmount', headerName: 'Bid Amount', width: 120 },
    { field: 'desiredMargin', headerName: 'Desired Margin', width: 120 },
    { field: 'estimatedMargin', headerName: 'Estimated Margin', width: 120 },
    { field: 'actualMargin', headerName: 'Actual Margin', width: 120 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'scope', headerName: 'Scope', width: 120 },
    { field: 'site', headerName: 'Site', width: 120 },
    { field: 'contract', headerName: 'Contract', width: 120 },
    { field: 'durationMonths', headerName: 'Duration (months)', width: 150 },
    { field: 'regulatory', headerName: 'Regulatory', width: 120 },
    { field: 'weather', headerName: 'Weather', width: 120 },
    { field: 'clientRating', headerName: 'Client Rating', width: 120 },
    {
        field: 'materialAvailability',
        headerName: 'Material Avail.',
        width: 120,
    },
    { field: 'laborAvailability', headerName: 'Labor Avail.', width: 120 },
    {
        field: 'competitiveLandscape',
        headerName: 'Competitive Landscape',
        width: 160,
    },
    { field: 'community', headerName: 'Community', width: 120 },
    { field: 'safety', headerName: 'Safety', width: 120 },
    { field: 'scopeClarity', headerName: 'Scope Clarity', width: 120 },
    { field: 'futureBusiness', headerName: 'Future Business', width: 120 },
    { field: 'risk', headerName: 'Risk', width: 120 },
    {
        field: 'clientFinancialHealth',
        headerName: 'Client Financial Health',
        width: 160,
    },
    { field: 'clientReputation', headerName: 'Client Reputation', width: 160 },
];

const rows = [
    {
        id: 1,
        projectNo: 'P001',
        status: 'Completed',
        recommendedAction: 'Bid',
        jobName: 'Project A',
        bidDueDate: '2023-10-30',
        jobStartDate: '2023-11-15',
        jobEndDate: '2024-01-30',
        leadFrom: 'Online Advertisement',
        bidMgr: 'John Doe',
        customerContactInfo: 'john.doe@example.com',
        customerName: 'ABC Corporation',
        jobLocationAddress: '123 Main Street, City, Country',
        estimatedTotalCost: '$100,000',
        estimatedMaterialCost: '$40,000',
        estimatedLaborCost: '$60,000',
        bidAmount: '$120,000',
        desiredMargin: '15%',
        estimatedMargin: '20%',
        actualMargin: '18%',
        type: 'Construction',
        scope: 'Full Scope',
        site: 'Site A',
        contract: 'Standard',
        durationMonths: 6,
        regulatory: '$5,000',
        weather: 'Clear',
        clientRating: 'Excellent',
        materialAvailability: 'High',
        laborAvailability: 'Medium',
        competitiveLandscape: 'Moderate',
        community: 'Friendly',
        safety: 'High',
        scopeClarity: 'Good',
        futureBusiness: 'Possible',
        risk: 'Low',
        clientFinancialHealth: 'Strong',
        clientReputation: 'Positive',
    },
    {
        id: 2,
        projectNo: 'P002',
        status: 'Completed',
        recommendedAction: 'No Bid',
        jobName: 'Project B',
        bidDueDate: '2023-11-10',
        jobStartDate: '2023-12-01',
        jobEndDate: '2024-02-15',
        leadFrom: 'Referral',
        bidMgr: 'Jane Smith',
        customerContactInfo: 'jane.smith@example.com',
        customerName: 'XYZ Corporation',
        jobLocationAddress: '456 Elm Street, Town, Country',
        estimatedTotalCost: '$80,000',
        estimatedMaterialCost: '$35,000',
        estimatedLaborCost: '$45,000',
        bidAmount: '$90,000',
        desiredMargin: '12%',
        estimatedMargin: '15%',
        actualMargin: '10%',
        type: 'Renovation',
        scope: 'Partial Scope',
        site: 'Site B',
        contract: 'Custom',
        durationMonths: 4,
        regulatory: '$2,000',
        weather: 'Partly Cloudy',
        clientRating: 'Good',
        materialAvailability: 'Medium',
        laborAvailability: 'Low',
        competitiveLandscape: 'High',
        community: 'Neutral',
        safety: 'Moderate',
        scopeClarity: 'Average',
        futureBusiness: 'Unlikely',
        risk: 'Moderate',
        clientFinancialHealth: 'Stable',
        clientReputation: 'Neutral',
    },
    {
        id: 3,
        projectNo: 'P003',
        status: 'In Progress',
        recommendedAction: 'Pending',
        jobName: 'Project C',
        bidDueDate: '2023-09-15',
        jobStartDate: '2023-10-01',
        jobEndDate: '2023-12-30',
        leadFrom: 'Cold Call',
        bidMgr: 'David Johnson',
        customerContactInfo: 'david.johnson@example.com',
        customerName: 'LMN Corporation',
        jobLocationAddress: '789 Oak Avenue, Village, Country',
        estimatedTotalCost: '$120,000',
        estimatedMaterialCost: '$50,000',
        estimatedLaborCost: '$70,000',
        bidAmount: '$130,000',
        desiredMargin: '8%',
        estimatedMargin: '10%',
        actualMargin: '12%',
        type: 'New Build',
        scope: 'Full Scope',
        site: 'Site C',
        contract: 'Standard',
        durationMonths: 8,
        regulatory: '$7,000',
        weather: 'Sunny',
        clientRating: 'Excellent',
        materialAvailability: 'High',
        laborAvailability: 'High',
        competitiveLandscape: 'Low',
        community: 'Friendly',
        safety: 'High',
        scopeClarity: 'Excellent',
        futureBusiness: 'Likely',
        risk: 'Low',
        clientFinancialHealth: 'Strong',
        clientReputation: 'Positive',
    },
];

const Bids = () => {
    return (
        <Container maxWidth={false}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ marginBottom: 2 }}
            >
                <Typography color={'text.primary'}>Home</Typography>
                <Typography color={'text.primary'}>Bids</Typography>
            </Breadcrumbs>
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    sx={{
                        borderRadius: 4,
                        borderColor: 'none',
                    }}
                />
            </Box>
        </Container>
    );
};

export default Bids;
