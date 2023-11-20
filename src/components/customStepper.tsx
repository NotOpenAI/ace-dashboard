import { useState } from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    TextField,
    Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const steps = ['Basic Information', 'Attributes', 'Review'];

export default function HorizontalLinearStepper() {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    let stepContent;

    switch (activeStep) {
        case 0:
            stepContent = (
                <Box
                    sx={{
                        width: '100%',
                        paddingTop: 2,
                    }}
                >
                    <Typography variant={'subtitle1'}>
                        General Information
                    </Typography>
                    <Stack direction={'column'} spacing={1}>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            spacing={1}
                        >
                            <TextField label={'Job name'} sx={{ flex: 1 }} />
                            <DatePicker label={'Bid Due Date'} />
                        </Stack>
                        <Stack
                            direction={'row'}
                            justifyContent={'space-between'}
                            spacing={1}
                        >
                            <DatePicker label={'Est Start Date'} />
                            <DatePicker label={'Est End Date'} />
                        </Stack>
                    </Stack>
                </Box>
            );
            break;
        case 1:
            stepContent = (
                <>
                    <Button>Test2</Button>
                </>
            );
            break;
        default:
            stepContent = 'DEFAULT';
            break;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel id={index.toString()}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </>
            ) : (
                <>
                    {stepContent}
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color='inherit'
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button variant={'contained'} onClick={handleNext}>
                            {activeStep === steps.length - 1
                                ? 'Finish'
                                : 'Next'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
