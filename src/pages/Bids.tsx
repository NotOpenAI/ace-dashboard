import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import {
    GridRowsProp,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowId,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
} from '@mui/x-data-grid';
import renderStatus from '../renderer/renderStatus.tsx';
import { useState } from 'react';
import {
    Breadcrumbs,
    darken,
    lighten,
    Link,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import Footer from '../components/Footer.tsx';
import IconButton from '@mui/material/IconButton';
import { SPACING } from '../constants.tsx';

const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.8);

const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .row-theme--Approved': {
        backgroundColor: getBackgroundColor(
            theme.palette.success.main,
            theme.palette.mode
        ),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.success.main,
                    theme.palette.mode
                ),
            },
        },
    },
    '& .row-theme--Rejected': {
        backgroundColor: getBackgroundColor(
            theme.palette.error.main,
            theme.palette.mode
        ),
        '&:hover': {
            backgroundColor: getHoverBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode
            ),
        },
        '&.Mui-selected': {
            backgroundColor: getSelectedBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode
            ),
            '&:hover': {
                backgroundColor: getSelectedHoverBackgroundColor(
                    theme.palette.error.main,
                    theme.palette.mode
                ),
            },
        },
    },
}));

const initialRows: GridRowsProp = [
    {
        id: 1,
        projectStatus: 'New',
        desiredMargin: 0.2,
        bidMgrAction: 'Bid',
        jobName: 'Job 1',
        bidDueDate: new Date('1/1/23'),
        estJobStartDate: new Date('1/1/23'),
        estJobEndDate: new Date('11/1/23'),
        estJobDuration: 12,
        leadFrom: 'Joe',
        bidMgr: 'Rich',
        customerContactInfo: 'Bob',
        customerName: 'Customer1',
        jobLocation: 'Webster',
        manualEstTotalCost: '$10,000',
        manualEstMaterialCost: '$3,000',
        manualEstLaborCost: '$7,000',
        manualBidAmount: '$12,000',
        finalBidAmount: '$12,000',
        type: 'Residential',
        construction: 'New',
        framing: 'Wood',
        drywall: 'No',
        insulation: 'No',
        actCeiling: 'Yes',
        size: 'Low',
        sqFeet: 1000,
        site: 'Easy',
        contract: 'Lump Sum',
        season: 'Winter',
        materialAvail: 'Easy',
        laborAvail: 'Easy',
        competition: 'Low',
        community: 'Low',
        safety: 'Medium',
        scopeClarity: 'Clear',
        futureBusiness: 'Medium',
        jobRisk: 'Medium',
        clientHealth: 'High',
        clientReputation: 'Medium',
    },
    {
        id: 2,
        projectStatus: 'Approved',
        desiredMargin: 0.18,
        bidMgrAction: 'Bid',
        jobName: 'Job 2',
        bidDueDate: new Date('1/2/23'),
        estJobStartDate: new Date('1/2/23'),
        estJobEndDate: new Date('11/2/23'),
        estJobDuration: 10,
        leadFrom: 'Stan',
        bidMgr: 'Rich',
        customerContactInfo: 'Fred',
        customerName: 'Customer2',
        jobLocation: 'Ithaca',
        manualEstTotalCost: '$0',
        manualEstMaterialCost: '$0',
        manualEstLaborCost: '$0',
        manualBidAmount: '$0',
        finalBidAmount: '$11,800',
        type: 'Residential',
        construction: 'Renovation',
        framing: 'Metal',
        drywall: 'Yes',
        insulation: 'Yes',
        actCeiling: 'Yes',
        size: 'Medium',
        sqFeet: 2000,
        site: 'Moderate',
        contract: 'Design-Build',
        season: 'Spring',
        materialAvail: 'Medium',
        laborAvail: 'Easy',
        competition: 'Medium',
        community: 'Low',
        safety: 'High',
        scopeClarity: 'Some',
        futureBusiness: 'High',
        jobRisk: 'High',
        clientHealth: 'Low',
        clientReputation: 'Low',
    },
    {
        id: 3,
        projectStatus: 'In Progress',
        desiredMargin: 0.22,
        bidMgrAction: 'Bid',
        jobName: 'Job 3',
        bidDueDate: new Date('1/3/23'),
        estJobStartDate: new Date('1/3/23'),
        estJobEndDate: new Date('11/3/23'),
        estJobDuration: 14,
        leadFrom: 'Dick',
        bidMgr: 'Marcin',
        customerContactInfo: 'John',
        customerName: 'Customer1',
        jobLocation: 'Greece',
        manualEstTotalCost: '$0',
        manualEstMaterialCost: '$0',
        manualEstLaborCost: '$0',
        manualBidAmount: '$0',
        finalBidAmount: '$36,600',
        type: 'Industrial',
        construction: 'Both',
        framing: 'Metal',
        drywall: 'Yes',
        insulation: 'No',
        actCeiling: 'High',
        size: 'Difficult',
        sqFeet: 5000,
        site: 'Difficult',
        contract: 'Lump Sum',
        season: 'Summer',
        materialAvail: 'Hard',
        laborAvail: 'Easy',
        competition: 'High',
        community: 'Medium',
        safety: 'Low',
        scopeClarity: 'Vague',
        futureBusiness: 'Low',
        jobRisk: 'Low',
        clientHealth: 'High',
        clientReputation: 'Medium',
    },
    {
        id: 4,
        projectStatus: 'Rejected',
        desiredMargin: 0.15,
        bidMgrAction: 'Bid',
        jobName: 'Job 4',
        bidDueDate: new Date('1/4/23'),
        estJobStartDate: new Date('1/4/23'),
        estJobEndDate: new Date('11/4/23'),
        estJobDuration: 11,
        leadFrom: 'Amanda',
        bidMgr: 'Melissa',
        customerContactInfo: 'Amy',
        customerName: 'Customer1',
        jobLocation: 'Penfield',
        manualEstTotalCost: '$0',
        manualEstMaterialCost: '$0',
        manualEstLaborCost: '$0',
        manualBidAmount: '$0',
        finalBidAmount: '$23,000',
        type: 'Commercial',
        construction: 'New',
        framing: 'None',
        drywall: 'Yes',
        insulation: 'Yes',
        actCeiling: 'No',
        size: 'Medium',
        sqFeet: 8000,
        site: 'Moderate',
        contract: 'Design-Build',
        season: 'Fall',
        materialAvail: 'Medium',
        laborAvail: 'Labor_Avail',
        competition: 'Low',
        community: 'Medium',
        safety: 'Low',
        scopeClarity: 'Vague',
        futureBusiness: 'Low',
        jobRisk: 'High',
        clientHealth: 'Medium',
        clientReputation: 'Medium',
    },
    {
        id: 5,
        projectStatus: 'Approved',
        desiredMargin: 0.2,
        bidMgrAction: 'Bid',
        jobName: 'Job 5',
        bidDueDate: new Date('1/5/23'),
        estJobStartDate: new Date('1/5/23'),
        estJobEndDate: new Date('11/5/23'),
        estJobDuration: 13,
        leadFrom: 'Amanda',
        bidMgr: 'Ethan',
        customerContactInfo: 'Frank',
        customerName: 'Customer1',
        jobLocation: 'Fairport',
        manualEstTotalCost: '$0',
        manualEstMaterialCost: '$0',
        manualEstLaborCost: '$0',
        manualBidAmount: '$0',
        finalBidAmount: '$12,000',
        type: 'Residential',
        construction: 'Renovation',
        framing: 'Wood',
        drywall: 'No',
        insulation: 'No',
        actCeiling: 'Yes',
        size: 'High',
        sqFeet: 11000,
        site: 'Difficult',
        contract: 'Lump Sum',
        season: 'Spring',
        materialAvail: 'Medium',
        laborAvail: 'Medium',
        competition: 'High',
        community: 'Medium',
        safety: 'Medium',
        scopeClarity: 'High',
        futureBusiness: 'Medium',
        jobRisk: 'High',
        clientHealth: 'Medium',
        clientReputation: 'Medium',
    },
];

interface SelectOptions {
    [key: string]: string[];
}

function BidsToolbar() {
    return (
        <GridToolbarContainer style={{ width: '100%', display: 'block' }}>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignContent={'space-between'}
            >
                <Stack direction={'row'} spacing={1}>
                    <GridToolbarColumnsButton sx={{ borderRadius: 3, p: 1 }} />
                    <GridToolbarFilterButton sx={{ borderRadius: 3, p: 1 }} />
                    <GridToolbarDensitySelector
                        sx={{ borderRadius: 3, p: 1 }}
                    />
                    <GridToolbarExport sx={{ borderRadius: 3, p: 1 }} />
                </Stack>
                <Button
                    color={'primary'}
                    variant={'text'}
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 3, p: 1 }}
                >
                    New Proposal
                </Button>
            </Stack>
        </GridToolbarContainer>
    );
}

export default function Bids() {
    const [rows, setRows] = useState(initialRows);

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const columns: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <Link href={`bids/${id}`}>
                        <IconButton size={'small'}>
                            <OpenInNewRoundedIcon fontSize={'small'} />
                        </IconButton>
                    </Link>,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label='Delete'
                        onClick={handleDeleteClick(id)}
                        color='inherit'
                    />,
                ];
            },
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 65,
            editable: false,
            type: 'number',
            disableColumnMenu: true,
        },
        {
            field: 'projectStatus',
            headerName: 'Project Status',
            renderCell: renderStatus,
            width: 150,
        },
        {
            field: 'desiredMargin',
            headerName: 'Desired Margin',
            width: 150,
            type: 'number',
        },
        {
            field: 'bidMgrAction',
            headerName: 'Bid Mgr Action',
            width: 150,
        },
        {
            field: 'jobName',
            headerName: 'Job Name',
            width: 150,
            type: 'string',
        },
        {
            field: 'bidDueDate',
            headerName: 'Due Date',
            width: 110,
            type: 'date',
        },
        {
            field: 'estJobStartDate',
            headerName: 'Est Start Date',
            width: 110,
            type: 'date',
        },
        {
            field: 'estJobEndDate',
            headerName: 'Est End Date',
            width: 110,
            type: 'date',
        },
        {
            field: 'estJobDuration',
            headerName: 'Est Duration',
            width: 110,
            type: 'number',
        },
        {
            field: 'leadFrom',
            headerName: 'Lead From',
            width: 120,
        },
        {
            field: 'bidMgr',
            headerName: 'Bid Mgr',
            width: 120,
        },
        {
            field: 'customerContactInfo',
            headerName: 'Customer Contact Info',
            width: 180,
            type: 'string',
        },
        {
            field: 'customerName',
            headerName: 'Customer Name',
            width: 150,
            type: 'string',
        },
        {
            field: 'jobLocation',
            headerName: 'Job Location',
            width: 130,
            type: 'string',
        },
        {
            field: 'manualEstTotalCost',
            headerName: 'Manual Est Total Cost',
            width: 150,
            type: 'string',
        },
        {
            field: 'manualEstMaterialCost',
            headerName: 'Manual Est Material Cost',
            width: 150,
            type: 'string',
        },
        {
            field: 'manualEstLaborCost',
            headerName: 'Manual Est Labor Cost',
            width: 150,
            type: 'string',
        },
        {
            field: 'manualBidAmount',
            headerName: 'Manual Bid Amount',
            width: 150,
            type: 'string',
        },
        {
            field: 'finalBidAmount',
            headerName: 'Final Bid Amount',
            width: 150,
            type: 'string',
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 150,
        },
        {
            field: 'construction',
            headerName: 'Construction',
            width: 150,
        },
        {
            field: 'framing',
            headerName: 'Framing',
            width: 150,
        },
        {
            field: 'drywall',
            headerName: 'Drywall',
            width: 150,
        },
        {
            field: 'insulation',
            headerName: 'Insulation',
            width: 150,
        },
        {
            field: 'actCeiling',
            headerName: 'ACT Ceiling',
            width: 150,
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 150,
        },
        {
            field: 'sqFeet',
            headerName: 'Sq Feet',
            width: 150,
        },
        {
            field: 'site',
            headerName: 'Site',
            width: 150,
        },
        {
            field: 'contract',
            headerName: 'Contract',
            width: 150,
        },
        {
            field: 'season',
            headerName: 'Season',
            width: 150,
        },
        {
            field: 'materialAvail',
            headerName: 'Material Avail',
            width: 150,
        },
        {
            field: 'laborAvail',
            headerName: 'Labor Avail',
            width: 150,
        },
        {
            field: 'competition',
            headerName: 'Competition',
            width: 150,
        },
        {
            field: 'community',
            headerName: 'Community',
            width: 150,
        },
        {
            field: 'safety',
            headerName: 'Safety',
            width: 150,
        },
        {
            field: 'scopeClarity',
            headerName: 'Scope Clarity',
            width: 150,
        },
        {
            field: 'futureBusiness',
            headerName: 'Future Business',
            width: 150,
        },
        {
            field: 'jobRisk',
            headerName: 'Job Risk',
            width: 150,
        },
        {
            field: 'clientHealth',
            headerName: 'Client Health',
            width: 150,
        },
        {
            field: 'clientReputation',
            headerName: 'Client Reputation',
            width: 150,
        },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize='small' />}>
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Typography color={'text.primary'}>Bids</Typography>
            </Breadcrumbs>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                spacing={SPACING}
                sx={{ paddingY: SPACING }}
            >
                {[
                    'Total Bids',
                    'Total Customers',
                    'Top Managers',
                    'Revenue',
                ].map((title) => (
                    <Paper
                        key={title}
                        elevation={1}
                        sx={{ borderRadius: 4, p: 4, width: '100%' }}
                    >
                        <Stack direction={'row'} alignItems={'center'}>
                            <Typography color={'text.primary'}>
                                {title}
                            </Typography>
                            <Typography color={'text.primary'}></Typography>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
            <Paper elevation={1} sx={{ borderRadius: 4, width: '100%' }}>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    getRowClassName={(params) =>
                        `row-theme--${params.row.projectStatus}`
                    }
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                type: false,
                                construction: false,
                                framing: false,
                                drywall: false,
                                insulation: false,
                                actCeiling: false,
                                size: false,
                                sqFeet: false,
                                site: false,
                                contract: false,
                                season: false,
                                materialAvail: false,
                                laborAvail: false,
                                competition: false,
                                community: false,
                                safety: false,
                                scopeClarity: false,
                                futureBusiness: false,
                                jobRisk: false,
                                clientHealth: false,
                                clientReputation: false,
                            },
                        },
                    }}
                    slots={{ toolbar: BidsToolbar }}
                    sx={{ border: 0 }}
                    disableRowSelectionOnClick
                />
            </Paper>
            <Footer />
        </Box>
    );
}
