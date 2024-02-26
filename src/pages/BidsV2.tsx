import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useEffect, useState } from 'react';
import {
    Breadcrumbs,
    LinearProgress,
    Link,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import Footer from '../components/Footer.tsx';
import { BASE_URL, SPACING } from '../constants.tsx';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Bid {
    id: number;
    lead: string;
    margin: number;
    due_date: string;
    approved: boolean;
    final_amt: string;
    initial_bid_amt: string;
    bid_manager: {
        username: string;
        first_name: string;
        last_name: string;
        id: number;
    };
    bid_type: {
        name: string;
        id: number;
    };
    contract_type: {
        name: string;
        id: number;
    };
    created_at: string;
    updated_at: string | null;
}

interface Attribute {
    id: number;
    num_val: number;
    type: {
        name: string;
        id: number;
    };
    option: string | null;
    created_at: string;
    updated_at: string | null;
}

interface AttributeType {
    name: string;
    id: number;
    active: boolean;
    required: boolean;
    options: string[];
}

export default function BidsV2() {
    const [bids, setBids] = useState([]);
    const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBids();
        fetchAttributeTypes();
    }, []);

    const fetchBids = () => {
        axios
            .get(BASE_URL + 'bids')
            .then((response) => {
                console.log(response.data.data);
                setBids(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const fetchAttributeTypes = () => {
        axios
            .get(BASE_URL + 'bids/attribute-types')
            .then((response) => {
                console.log(response.data.data);
                setAttributeTypes(response.data.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const columns: GridColDef[] = [
        { field: 'lead', headerName: 'Lead', width: 150 },
        { field: 'margin', headerName: 'Margin', type: 'number', width: 120 },
        { field: 'due_date', headerName: 'Due Date', width: 150 },
        {
            field: 'approved',
            headerName: 'Approved',
            type: 'boolean',
            width: 130,
        },
        {
            field: 'final_amt',
            headerName: 'Final Amount',
            type: 'number',
            width: 150,
        },
        {
            field: 'initial_bid_amt',
            headerName: 'Initial Bid Amount',
            type: 'number',
            width: 180,
        },
        {
            field: 'bid_manager.username',
            headerName: 'Bid Manager',
            width: 150,
        },
        { field: 'customer.name', headerName: 'Customer Name', width: 200 },
        { field: 'customer.phone', headerName: 'Customer Phone', width: 200 },
        {
            field: 'customer.address',
            headerName: 'Customer Address',
            width: 250,
        },
        { field: 'customer.owner', headerName: 'Customer Owner', width: 150 },
        { field: 'customer.market', headerName: 'Customer Market', width: 150 },
        {
            field: 'customer.reputation',
            headerName: 'Customer Reputation',
            type: 'number',
            width: 200,
        },
        {
            field: 'customer.fin_health',
            headerName: 'Customer Financial Health',
            type: 'number',
            width: 250,
        },
        { field: 'bid_type.name', headerName: 'Bid Type', width: 150 },
        {
            field: 'contract_type.name',
            headerName: 'Contract Type',
            width: 150,
        },
        {
            field: 'estimated_data.start_date',
            headerName: 'Estimated Start Date',
            width: 200,
        },
        {
            field: 'estimated_data.duration',
            headerName: 'Duration',
            type: 'number',
            width: 130,
        },
        {
            field: 'estimated_data.mat_cost',
            headerName: 'Material Cost',
            type: 'number',
            width: 150,
        },
        {
            field: 'estimated_data.labor_cost',
            headerName: 'Labor Cost',
            type: 'number',
            width: 150,
        },
        {
            field: 'estimated_data.end_date',
            headerName: 'Estimated End Date',
            width: 200,
        },
        {
            field: 'estimated_data.total_cost',
            headerName: 'Total Cost',
            type: 'number',
            width: 150,
        },
        {
            field: 'estimated_data.quickbid_amt',
            headerName: 'Quick Bid Amount',
            type: 'number',
            width: 180,
        },
        ...attributeTypes.map((attribute: AttributeType) => ({
            field: `attributes.${attribute.name.toLowerCase()}.num_val`,
            headerName: attribute.name,
            type: 'number',
            width: 150,
        })),
    ];

    return (
        <>
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
                        <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                        >
                            <Typography color={'text.primary'}>
                                {title}
                            </Typography>
                            <Typography color={'text.primary'}>
                                {title === 'Total Bids' && bids.length}
                                {title === 'Total Customers' && 1}
                                {title === 'Top Managers' &&
                                    'Marcin Suchodolski'}
                                {title === 'Revenue' && '$359,116'}
                            </Typography>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
            <Paper elevation={1} sx={{ borderRadius: 4 }}>
                <DataGrid
                    rows={bids}
                    columns={columns}
                    slots={{ loadingOverlay: LinearProgress }}
                    sx={{ border: 0 }}
                    loading={loading}
                    autoHeight
                    disableRowSelectionOnClick
                />
            </Paper>
            <Footer />
        </>
    );
}
