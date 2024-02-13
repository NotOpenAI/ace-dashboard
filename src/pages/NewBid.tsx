import {
    Breadcrumbs,
    Button,
    capitalize,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { SPACING } from '../constants.tsx';
import CustomSelect from '../components/customSelect.tsx';
import Footer from '../components/Footer.tsx';
import { Masonry } from '@mui/lab';
import { useState } from 'react';
import CreateAttribute from '../components/createAttribute.tsx';
import DeleteAttribute from '../components/deleteAttribute.tsx';
import { NavLink as RouterLink } from 'react-router-dom';

export const NewBid = () => {
    const [generalInfo] = useState({
        title: 'General Information',
        subfields: [
            {
                name: 'id',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'projectStatus',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'desiredMargin',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'bidMgrAction',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'jobName',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'bidDueDate',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'estJobStartDate',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'estJobEndDate',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'estJobDuration',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'leadFrom',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'bidMgr',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'customerContactInfo',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'customerName',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'jobLocation',
                inputType: 'text',
                value: '',
                options: [],
            },
        ],
    });

    const [costsInfo] = useState({
        title: 'Costs',
        subfields: [
            {
                name: 'manualEstTotalCost',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'manualEstMaterialCost',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'manualEstLaborCost',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'manualBidAmount',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'finalBidAmount',
                inputType: 'text',
                value: '',
                options: [],
            },
        ],
    });

    const [attributesInfo, setAttributesInfo] = useState({
        title: 'Attributes',
        subfields: [
            {
                name: 'inputType',
                inputType: 'select',
                value: '',
                options: [],
            },
            {
                name: 'construction',
                inputType: 'select',
                value: '',
                options: ['New', 'Renovation', 'Both'],
            },
            {
                name: 'framing',
                inputType: 'select',
                value: '',
                options: ['Wood', 'Metal', 'None'],
            },
            {
                name: 'drywall',
                inputType: 'select',
                value: '',
                options: ['No', 'Yes'],
            },
            {
                name: 'insulation',
                inputType: 'select',
                value: '',
                options: ['No', 'Yes'],
            },
            {
                name: 'actCeiling',
                inputType: 'select',
                value: '',
                options: ['No', 'Yes'],
            },
            {
                name: 'size',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
            {
                name: 'sqFeet',
                inputType: 'text',
                value: '',
                options: [],
            },
            {
                name: 'site',
                inputType: 'select',
                value: '',
                options: ['Easy', 'Moderate', 'Difficult'],
            },
            {
                name: 'contract',
                inputType: 'select',
                value: '',
                options: ['Lump Sum', 'Design Build'],
            },
            {
                name: 'season',
                inputType: 'select',
                value: '',
                options: ['Winter', 'Spring', 'Summer', 'Fall'],
            },
            {
                name: 'materialAvail',
                inputType: 'select',
                value: '',
                options: ['Easy', 'Medium', 'Hard'],
            },
            {
                name: 'laborAvail',
                inputType: 'select',
                value: '',
                options: ['Easy', 'Medium', 'Hard'],
            },
            {
                name: 'competition',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
            {
                name: 'community',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
            {
                name: 'safety',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
            {
                name: 'scopeClarity',
                inputType: 'select',
                value: '',
                options: ['Clear', 'Some', 'Vague'],
            },
            {
                name: 'futureBusiness',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
            {
                name: 'jobRisk',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
            {
                name: 'clientHealth',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
            {
                name: 'clientReputation',
                inputType: 'select',
                value: '',
                options: ['Low', 'Medium', 'High'],
            },
        ],
    });

    const handleAddAttribute = (attributeData: {
        name: string;
        inputType: string;
        options: string[];
        value: string;
    }) => {
        setAttributesInfo({
            title: attributesInfo.title,
            subfields: [...attributesInfo.subfields, attributeData],
        });
    };

    const handleDeleteAttribute = (attributeName: string) => {
        setAttributesInfo((prevState) => ({
            ...prevState,
            subfields: prevState.subfields.filter(
                (attr) => attr.name !== attributeName
            ),
        }));
    };

    return (
        <>
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
                <Typography color={'text.primary'}>New</Typography>
            </Breadcrumbs>
            <Masonry columns={2} spacing={SPACING}>
                {[generalInfo, attributesInfo, costsInfo].map(
                    ({ title, subfields }) => (
                        <Paper
                            key={title}
                            elevation={1}
                            sx={{
                                borderRadius: 4,
                                p: 2,
                            }}
                        >
                            <Typography
                                variant={'h6'}
                                fontWeight={'light'}
                                paddingBottom={SPACING}
                            >
                                {title}
                            </Typography>
                            <Masonry columns={3} spacing={SPACING}>
                                {subfields.map(
                                    ({ name, inputType, value, options }) => (
                                        <div key={name}>
                                            {inputType === 'select' && (
                                                <CustomSelect
                                                    label={capitalize(name)}
                                                    options={options}
                                                    required={false}
                                                />
                                            )}
                                            {inputType === 'text' && (
                                                <TextField
                                                    variant={'outlined'}
                                                    label={capitalize(name)}
                                                    defaultValue={value}
                                                    fullWidth
                                                />
                                            )}
                                        </div>
                                    )
                                )}
                                {title === 'Attributes' && (
                                    <CreateAttribute
                                        handleAddAttribute={handleAddAttribute}
                                    />
                                )}
                                {title === 'Attributes' && (
                                    <DeleteAttribute
                                        options={attributesInfo.subfields}
                                        handleDeleteAttribute={
                                            handleDeleteAttribute
                                        }
                                    />
                                )}
                            </Masonry>
                        </Paper>
                    )
                )}
            </Masonry>
            <Stack
                direction={'row'}
                justifyContent={'flex-end'}
                spacing={1}
                paddingTop={4}
            >
                <Button
                    variant={'text'}
                    color={'inherit'}
                    component={RouterLink}
                    to={'/bids'}
                >
                    Cancel
                </Button>
                <Button variant={'contained'}>Create</Button>
            </Stack>
            <Footer />
        </>
    );
};
