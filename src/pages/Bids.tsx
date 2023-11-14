import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
} from '@mui/x-data-grid';
import renderStatus from '../renderer/renderStatus.tsx';
import renderDesiredMargin from '../renderer/renderDesiredMargin.tsx';
import { useState } from 'react';
import { darken, lighten, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

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

interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
}

interface SelectOptions {
    [key: string]: string[];
}

function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        setRows((oldRows) => {
            const maxId = Math.max(...oldRows.map((row) => row.id), 0);
            const newId = maxId + 1;

            setRowModesModel((oldModel) => ({
                ...oldModel,
                [newId]: { mode: GridRowModes.Edit, fieldToFocus: 'jobName' },
            }));

            return [...oldRows, { id: newId, name: '', age: '', isNew: true }];
        });
    };

    return (
        <GridToolbarContainer style={{ width: '100%', display: 'block' }}>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignContent={'space-between'}
            >
                <Stack direction={'row'} spacing={2}>
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                    <GridToolbarDensitySelector />
                    <GridToolbarExport />
                </Stack>
                <Button
                    color={'primary'}
                    variant={'contained'}
                    startIcon={<AddIcon />}
                    onClick={handleClick}
                >
                    New Proposal
                </Button>
            </Stack>
        </GridToolbarContainer>
    );
}

export default function Bids() {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (
        params,
        event
    ) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
        console.log(rowModesModel);
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const selectOptions: SelectOptions = {
        projectStatus: ['New', 'In Progress', 'Approved', 'Rejected'],
        bidMgr: ['Marcin', 'Ethan', 'Melissa', 'Rich'],
        leadFrom: ['Joe', 'Stan', 'Amanda', 'Frank', 'Dick'],
        type: ['Residential', 'Industrial', 'Commercial', 'Multifamily'],
        size: ['Low', 'Medium', 'High'],
        site: ['Easy', 'Moderate', 'Difficult'],
        contract: ['Lump Sum', 'Design Build'],
        community: ['Low', 'Medium', 'High'],
        season: ['Winter', 'Spring', 'Summer', 'Fall'],
        materialAvail: ['Easy', 'Medium', 'Hard'],
        laborAvail: ['Easy', 'Medium', 'Hard'],
        competition: ['Low', 'Medium', 'High'],
        safety: ['Low', 'Medium', 'High'],
        scopeClarity: ['Clear', 'Some', 'Vague'],
        futureBusiness: ['Low', 'Medium', 'High'],
        jobRisk: ['Low', 'Medium', 'High'],
        clientHealth: ['Low', 'Medium', 'High'],
        clientReputation: ['Low', 'Medium', 'High'],
        framing: ['Wood', 'Metal', 'None'],
        drywall: ['No', 'Yes'],
        insulation: ['No', 'Yes'],
        actCeiling: ['No', 'Yes'],
        construction: ['New', 'Renovation', 'Both'],
    };

    const columns: GridColDef[] = [
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label='Save'
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label='Cancel'
                            className='textPrimary'
                            onClick={handleCancelClick(id)}
                            color='inherit'
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label='Edit'
                        className='textPrimary'
                        onClick={handleEditClick(id)}
                        color='inherit'
                    />,
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
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['projectStatus'],
        },
        {
            field: 'desiredMargin',
            headerName: 'Desired Margin',
            renderCell: renderDesiredMargin,
            width: 150,
            editable: true,
            type: 'number',
        },
        {
            field: 'bidMgrAction',
            headerName: 'Bid Mgr Action',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: ['Bid', 'No Bid'],
        },
        {
            field: 'jobName',
            headerName: 'Job Name',
            width: 150,
            editable: true,
            type: 'string',
        },
        {
            field: 'bidDueDate',
            headerName: 'Due Date',
            width: 110,
            editable: true,
            type: 'date',
        },
        {
            field: 'estJobStartDate',
            headerName: 'Est Start Date',
            width: 110,
            editable: true,
            type: 'date',
        },
        {
            field: 'estJobEndDate',
            headerName: 'Est End Date',
            width: 110,
            editable: true,
            type: 'date',
        },
        {
            field: 'estJobDuration',
            headerName: 'Est Duration',
            width: 110,
            editable: true,
            type: 'number',
        },
        {
            field: 'leadFrom',
            headerName: 'Lead From',
            width: 120,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['leadFrom'],
        },
        {
            field: 'bidMgr',
            headerName: 'Bid Mgr',
            width: 120,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['bidMgr'],
        },
        {
            field: 'customerContactInfo',
            headerName: 'Customer Contact Info',
            width: 180,
            editable: true,
            type: 'string',
        },
        {
            field: 'customerName',
            headerName: 'Customer Name',
            width: 150,
            editable: true,
            type: 'string',
        },
        {
            field: 'jobLocation',
            headerName: 'Job Location',
            width: 130,
            editable: true,
            type: 'string',
        },
        {
            field: 'manualEstTotalCost',
            headerName: 'Manual Est Total Cost',
            width: 150,
            editable: true,
            type: 'string',
        },
        {
            field: 'manualEstMaterialCost',
            headerName: 'Manual Est Material Cost',
            width: 150,
            editable: true,
            type: 'string',
        },
        {
            field: 'manualEstLaborCost',
            headerName: 'Manual Est Labor Cost',
            width: 150,
            editable: true,
            type: 'string',
        },
        {
            field: 'manualBidAmount',
            headerName: 'Manual Bid Amount',
            width: 150,
            editable: true,
            type: 'string',
        },
        {
            field: 'finalBidAmount',
            headerName: 'Final Bid Amount',
            width: 150,
            editable: true,
            type: 'string',
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['type'],
        },
        {
            field: 'construction',
            headerName: 'Construction',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['construction'],
        },
        {
            field: 'framing',
            headerName: 'Framing',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['framing'],
        },
        {
            field: 'drywall',
            headerName: 'Drywall',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['drywall'],
        },
        {
            field: 'insulation',
            headerName: 'Insulation',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['insulation'],
        },
        {
            field: 'actCeiling',
            headerName: 'ACT Ceiling',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['actCeiling'],
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['size'],
        },
        {
            field: 'sqFeet',
            headerName: 'Sq Feet',
            width: 150,
            editable: true,
            type: 'singleSelect',
        },
        {
            field: 'site',
            headerName: 'Site',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['site'],
        },
        {
            field: 'contract',
            headerName: 'Contract',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['contract'],
        },
        {
            field: 'season',
            headerName: 'Season',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['season'],
        },
        {
            field: 'materialAvail',
            headerName: 'Material Avail',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['materialAvail'],
        },
        {
            field: 'laborAvail',
            headerName: 'Labor Avail',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['laborAvail'],
        },
        {
            field: 'competition',
            headerName: 'Competition',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['competition'],
        },
        {
            field: 'community',
            headerName: 'Community',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['community'],
        },
        {
            field: 'safety',
            headerName: 'Safety',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['safety'],
        },
        {
            field: 'scopeClarity',
            headerName: 'Scope Clarity',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['scopeClarity'],
        },
        {
            field: 'futureBusiness',
            headerName: 'Future Business',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['futureBusiness'],
        },
        {
            field: 'jobRisk',
            headerName: 'Job Risk',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['jobRisk'],
        },
        {
            field: 'clientHealth',
            headerName: 'Client Health',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['clientHealth'],
        },
        {
            field: 'clientReputation',
            headerName: 'Client Reputation',
            width: 150,
            editable: true,
            type: 'singleSelect',
            valueOptions: selectOptions['clientReputation'],
        },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <StyledDataGrid
                rows={rows}
                columns={columns}
                editMode={'row'}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
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
                slots={{
                    toolbar: EditToolbar,
                }}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
