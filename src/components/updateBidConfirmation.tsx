import { Box, Button, Modal, Typography, Stack } from '@mui/material';
import { Bid } from '../pages/bids/NewBid.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SPACING } from '../constants.tsx';

type NewAttributeProps = {
    updatedBid?: Bid;
    originalBid?: Bid;
    onSave: () => void;
};

type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

const UpdateBidConfirmation = ({
    updatedBid,
    originalBid,
    onSave,
}: NewAttributeProps) => {
    const [accessToken, setAccessToken] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAccessToken(token);
        } else {
            navigate('/login');
        }
    }, []);

    const [open, setOpen] = useState(false);

    const [changes, setChanges] = useState<object>();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getObjectChanges = (original?: Bid, updated?: Bid) => {
        const changes: DeepPartial<T> = {};

        for (const key in original) {
            if (original.hasOwnProperty(key)) {
                const originalValue = original[key];
                const updatedValue = updated[key];

                if (
                    typeof originalValue === 'object' &&
                    typeof updatedValue === 'object'
                ) {
                    const nestedChanges = getObjectChanges(
                        originalValue,
                        updatedValue
                    );
                    if (Object.keys(nestedChanges).length > 0) {
                        changes[key] = nestedChanges;
                    }
                } else if (originalValue !== updatedValue) {
                    changes[key] = {
                        original: originalValue,
                        updated: updatedValue,
                    };
                }
            }
        }

        return changes;
    };

    return (
        <>
            <Button variant={'contained'} onClick={handleOpen}>
                Save
            </Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        width: 500,
                        p: 4,
                    }}
                >
                    <Typography
                        variant={'h6'}
                        fontWeight={'light'}
                        textAlign={'center'}
                        paddingBottom={2}
                    >
                        Are you sure you want to update the bid?
                    </Typography>
                    <Typography variant={'body1'}>
                        Properties changed:
                    </Typography>
                    <Stack direction={'column'} spacing={SPACING}>
                        {}
                    </Stack>

                    <Stack
                        direction={'row'}
                        justifyContent={'flex-end'}
                        spacing={1}
                    >
                        <Button
                            variant={'text'}
                            color={'inherit'}
                            sx={{ marginTop: 1 }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={'contained'}
                            onClick={onSave}
                            sx={{ marginTop: 1 }}
                        >
                            Save
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};

export default UpdateBidConfirmation;
