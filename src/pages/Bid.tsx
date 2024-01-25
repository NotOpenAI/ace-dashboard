import {
    Box,
    Breadcrumbs,
    Container,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SPACING } from '../constants.tsx';
import CustomSelect from '../components/customSelect.tsx';

const FIELDS = [
    [
        'id',
        'projectStatus',
        'desiredMargin',
        'bidMgrAction',
        'jobName',
        'bidDueDate',
        'estJobStartDate',
        'estJobEndDate',
        'estJobDuration',
        'leadFrom',
        'bidMgr',
        'customerContactInfo',
        'customerName',
        'jobLocation',
    ],
    [
        'manualEstTotalCost',
        'manualEstMaterialCost',
        'manualEstLaborCost',
        'manualBidAmount',
        'finalBidAmount',
    ],
    [
        'type',
        'construction',
        'framing',
        'drywall',
        'insulation',
        'actCeiling',
        'size',
        'sqFeet',
        'site',
        'contract',
        'season',
        'materialAvail',
        'laborAvail',
        'competition',
        'community',
        'safety',
        'scopeClarity',
        'futureBusiness',
        'jobRisk',
        'clientHealth',
        'clientReputation',
    ],
];

const SELECT_OPTIONS = {
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
export const Bid = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: SPACING }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Link href={'/bids'} color={'inherit'} underline={'hover'}>
                    Bids
                </Link>
                <Typography color={'text.primary'}>1</Typography>
            </Breadcrumbs>
            <Container maxWidth={'xl'}>
                <Stack direction={'column'} spacing={SPACING}>
                    <Stack direction={'row'} spacing={SPACING}>
                        {FIELDS.map((subfields) => (
                            <Paper
                                elevation={1}
                                sx={{
                                    borderRadius: 4,
                                    width: '100%',
                                    p: 2,
                                    height: 300,
                                }}
                            >
                                {subfields.map((subfield) =>
                                    subfield in SELECT_OPTIONS ? (
                                        <CustomSelect
                                            label={subfield}
                                            options={
                                                SELECT_OPTIONS[
                                                    subfield as keyof typeof SELECT_OPTIONS
                                                ]
                                            }
                                        />
                                    ) : (
                                        <TextField
                                            variant={'standard'}
                                            label={subfield}
                                            defaultValue={'test'}
                                        />
                                    )
                                )}
                            </Paper>
                        ))}
                    </Stack>
                    <Paper
                        elevation={1}
                        sx={{
                            borderRadius: 4,
                            width: '100%',
                            p: 2,
                            height: 300,
                        }}
                    ></Paper>
                </Stack>
            </Container>
        </Box>
    );
};
