import {
    Backdrop,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    Link,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import convertToSentenceCase from '../../utils/convertToSentenceCase.tsx';
import { compareAttributes } from '../../utils/compareAttributes.tsx';
import { Attribute, AttributeOption } from '../../types/Bid.tsx';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Footer from '../../components/Footer.tsx';
import { BASE_URL } from '../../constants.tsx';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import axios from 'axios';

export const AttributeInfo = () => {
    const { id } = useParams();

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

    const [attribute, setAttribute] = useState<Attribute>();
    const [originalAttribute, setOriginalAttribute] = useState<Attribute>();
    const [loading, setLoading] = useState<boolean>(true);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (accessToken) {
            fetchAttribute();
        }
    }, [accessToken]);

    const fetchAttribute = () => {
        axios
            .get(`${BASE_URL}/bids/attribute-types`, {
                headers: {
                    Authorization: `Bearer ${encodeURIComponent(accessToken)}`,
                },
            })
            .then((response) => {
                if (typeof id === 'string') {
                    let attr: Attribute = response.data.data.find(
                        (att: Attribute) => att.id === parseInt(id)
                    );
                    console.log('Attribute', attr);
                    setAttribute(attr);
                    setOriginalAttribute(attr);
                }
            })
            .catch((error) =>
                enqueueSnackbar(error.response.data.detail, {
                    variant: 'error',
                })
            )
            .finally(() => setLoading(false));
    };

    const handleOptionFieldChange = (
        optionIndex: number,
        key: string,
        value: string
    ) => {
        setAttribute((prevAttribute) => {
            if (!prevAttribute) return prevAttribute;

            const updatedOptions = [...prevAttribute.options];
            updatedOptions[optionIndex] = {
                ...updatedOptions[optionIndex],
                [key]: value,
            };

            return {
                ...prevAttribute,
                options: updatedOptions,
            };
        });
    };

    const handleDeleteOption = (optionId: number) => {
        setAttribute((prevAttribute) => {
            if (!prevAttribute) return prevAttribute;

            const updatedOptions = prevAttribute.options.filter(
                (option) => option.id !== optionId
            );

            return {
                ...prevAttribute,
                options: updatedOptions,
            };
        });
    };

    const handleCancel = () => {
        setAttribute(originalAttribute);
    };

    const handleSave = () => {
        if (originalAttribute && attribute) {
            setUpdateLoading(true);

            const payload = compareAttributes(originalAttribute, attribute);

            axios
                .put(`${BASE_URL}/bids/attribute-types/${id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${encodeURIComponent(
                            accessToken
                        )}`,
                    },
                })
                .then((response) => {
                    console.log(response.data.data);
                })
                .catch((error) => {
                    console.error(error);
                    enqueueSnackbar(error.response.data.detail, {
                        variant: 'error',
                    });
                })
                .finally(() => setUpdateLoading(false));
        }
    };

    // @ts-ignore
    return (
        <>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize='small' />}
                sx={{ paddingBottom: 2 }}
            >
                <Link href={'/'} color={'inherit'} underline={'hover'}>
                    Home
                </Link>
                <Link
                    href={'/attributes'}
                    color={'inherit'}
                    underline={'hover'}
                >
                    Attributes
                </Link>
                <Typography color={'text.primary'}>{id}</Typography>
            </Breadcrumbs>
            {loading ? (
                <Box textAlign={'center'}>
                    <CircularProgress />
                </Box>
            ) : (
                <Container maxWidth={'md'}>
                    <Paper elevation={1} sx={{ borderRadius: 4, p: 2 }}>
                        <Typography variant={'h6'}>Attribute</Typography>
                        <Stack
                            direction={'column'}
                            spacing={2}
                            divider={
                                <Divider orientation={'horizontal'} flexItem />
                            }
                            sx={{ paddingY: 2 }}
                        >
                            <Stack direction={'row'} spacing={1}>
                                <TextField
                                    variant={'outlined'}
                                    label={'ID'}
                                    defaultValue={attribute?.id}
                                    disabled
                                />
                                <TextField
                                    variant={'outlined'}
                                    label={'Name'}
                                    value={
                                        attribute?.name
                                            ? convertToSentenceCase(
                                                  attribute?.name
                                              )
                                            : ''
                                    }
                                    fullWidth
                                    disabled
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Required</InputLabel>
                                    <Select
                                        value={attribute?.required}
                                        label={'Required'}
                                        onChange={(e) => {
                                            setAttribute({
                                                ...attribute,
                                                // @ts-ignore
                                                required: e.target.value,
                                            });
                                        }}
                                    >
                                        {[true, false].map((option, index) => (
                                            // @ts-ignore
                                            <MenuItem
                                                key={index}
                                                value={option}
                                            >
                                                {convertToSentenceCase(
                                                    String(option)
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Active</InputLabel>
                                    <Select
                                        value={attribute?.active}
                                        label={'Active'}
                                        onChange={(e) => {
                                            setAttribute({
                                                ...attribute,
                                                // @ts-ignore
                                                active: e.target.value,
                                            });
                                        }}
                                    >
                                        {[true, false].map((option, index) => (
                                            // @ts-ignore
                                            <MenuItem
                                                key={index}
                                                value={option}
                                            >
                                                {convertToSentenceCase(
                                                    String(option)
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack direction={'column'} spacing={1}>
                                {attribute?.options.map(
                                    (option: AttributeOption, index) => (
                                        <Stack
                                            key={option.id}
                                            direction={'row'}
                                            justifyContent={'space-between'}
                                            spacing={1}
                                        >
                                            <TextField
                                                variant={'outlined'}
                                                label={'Value'}
                                                value={option.value || ''}
                                                onChange={(e) =>
                                                    handleOptionFieldChange(
                                                        index,
                                                        'value',
                                                        e.target.value
                                                    )
                                                }
                                                fullWidth
                                            />
                                            <Tooltip
                                                title={'Remove'}
                                                placement={'bottom'}
                                                arrow
                                            >
                                                <IconButton
                                                    color={'error'}
                                                    sx={{ borderRadius: 1 }}
                                                    onClick={() =>
                                                        handleDeleteOption(
                                                            option.id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    )
                                )}
                            </Stack>
                        </Stack>
                        <Stack
                            direction={'row'}
                            justifyContent={'flex-end'}
                            spacing={1}
                        >
                            <Button color={'inherit'} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                variant={'contained'}
                                onClick={handleSave}
                                disabled={attribute === originalAttribute}
                            >
                                Save
                            </Button>
                        </Stack>
                    </Paper>
                </Container>
            )}
            <Backdrop
                open={updateLoading}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <CircularProgress color={'inherit'} />
            </Backdrop>
            <Footer />
        </>
    );
};
