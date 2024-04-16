import { Box, Button, Modal, Typography, Stack } from '@mui/material';
import { UpdateRequestBody } from '../types/Bid.tsx';
import { SPACING } from '../constants.tsx';
import { useState } from 'react';

type NewAttributeProps = {
    requestBody: UpdateRequestBody;
    onSave: () => void;
    disabled: boolean;
};

const UpdateBidConfirmation = ({
    requestBody,
    onSave,
    disabled,
}: NewAttributeProps) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Example mapping of property IDs to names
    const propertyNames: Record<string, string> = {
        name: 'Name',
        lead: 'Lead',
        foreman: 'Foreman',
        desired_margin: 'Desired Margin',
        start_date: 'Start Date',
        finish_date: 'Finish Date',
        bid_status_id: 'Bid Status',
        job_status_id: 'Job Status',
        original_contract: 'Original Contract',
        final_cost: 'Final Cost',
        bid_manager_ids: 'Bid Managers',
        project_manager_ids: 'Project Managers',
        attributes: 'Attributes',
    };

    const renderPropertyValue = (key: string, value: any) => {
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value, null, 2); // Pretty print objects
        } else {
            // Check if the key exists in propertyNames, if yes, use the name, otherwise use the key
            const propertyName = propertyNames[key] || key;
            return String(propertyName) + ': ' + String(value); // Render other types as string
        }
    };

    return (
        <>
            <Button
                variant={'contained'}
                onClick={handleOpen}
                disabled={disabled}
            >
                Save with Modal
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
                        {Object.entries(requestBody).map(([key, value]) => (
                            <Box key={key}>
                                <Typography
                                    variant='subtitle1'
                                    fontWeight='bold'
                                >
                                    {key}
                                </Typography>
                                <Typography variant='body2'>
                                    {renderPropertyValue(key, value)}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    <Stack direction={'column'} spacing={SPACING}>
                        {requestBody.attributes &&
                            requestBody.attributes.updated_attributes && (
                                <>
                                    <Typography variant={'body1'}>
                                        Updated Attributes:
                                    </Typography>
                                    {requestBody.attributes.updated_attributes.map(
                                        (attribute, index) => (
                                            <Box key={index}>
                                                <Typography
                                                    variant='subtitle1'
                                                    fontWeight='bold'
                                                >
                                                    Attribute {index + 1}
                                                </Typography>
                                                {Object.entries(attribute).map(
                                                    ([key, value]) => (
                                                        <Typography
                                                            key={key}
                                                            variant='body2'
                                                        >
                                                            {key}:{' '}
                                                            {JSON.stringify(
                                                                value
                                                            )}
                                                        </Typography>
                                                    )
                                                )}
                                            </Box>
                                        )
                                    )}
                                </>
                            )}

                        {requestBody.attributes &&
                            requestBody.attributes.deleted_attributes && (
                                <>
                                    <Typography variant={'body1'}>
                                        Deleted Attributes:
                                    </Typography>
                                    {requestBody.attributes.deleted_attributes.map(
                                        (id, index) => (
                                            <Typography
                                                key={index}
                                                variant='body2'
                                            >
                                                Attribute ID: {id}
                                            </Typography>
                                        )
                                    )}
                                </>
                            )}
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
