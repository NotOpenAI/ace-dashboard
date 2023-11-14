import {
    Box,
    Button,
    Grid,
    Modal,
    Step,
    StepButton,
    Stepper,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import CustomSelect from './customSelect.tsx'

const selectOptions = {
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
}

const fields = [
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
]

;[
    {
        columnName: 'foo',
        options: ['fizz', 'buzz'],
    },
    {
        columnName: 'bar',
        options: ['fuzz', 'bazz'],
    },
]

const NewBidProposal = () => {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [activeStep, setActiveStep] = useState(0)
    const [completed, setCompleted] = useState<{
        [k: number]: boolean
    }>({})

    const totalSteps = () => {
        return fields.length
    }

    const completedSteps = () => {
        return Object.keys(completed).length
    }

    const isLastStep = () => {
        return activeStep === totalSteps() - 1
    }

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps()
    }

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                  fields.findIndex((_step, i) => !(i in completed))
                : activeStep + 1
        setActiveStep(newActiveStep)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleStep = (step: number) => () => {
        setActiveStep(step)
    }

    const handleComplete = () => {
        const newCompleted = completed
        newCompleted[activeStep] = true
        setCompleted(newCompleted)
        handleNext()
    }

    const handleReset = () => {
        setActiveStep(0)
        setCompleted({})
    }

    return (
        <>
            <Button
                variant={'contained'}
                onClick={handleOpen}
                color={'primary'}
                startIcon={<AddIcon />}
                size={'small'}
                sx={{
                    borderRadius: 4,
                }}
            >
                New Proposal
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        // width: 1200,
                        // maxWidth: 1200,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                        {fields.map((_, index) => (
                            <Step key={index} completed={completed[index]}>
                                <StepButton
                                    color="inherit"
                                    onClick={handleStep(index)}
                                >
                                    {`Section ${index + 1}`}
                                </StepButton>
                            </Step>
                        ))}
                        {/*{steps.map((label, index) => (*/}
                        {/*    <Step key={label} completed={completed[index]}>*/}
                        {/*        <StepButton color="inherit" onClick={handleStep(index)}>*/}
                        {/*            {label}*/}
                        {/*        </StepButton>*/}
                        {/*    </Step>*/}
                        {/*))}*/}
                    </Stepper>
                    {allStepsCompleted() ? (
                        <>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    pt: 2,
                                }}
                            >
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </>
                    ) : (
                        <Box>
                            <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                                Step {activeStep + 1}
                            </Typography>

                            <Grid container spacing={1}>
                                {fields[activeStep].map((field, index) =>
                                    field in selectOptions ? (
                                        <Grid item width={230}>
                                            <CustomSelect
                                                label={field}
                                                options={
                                                    selectOptions[
                                                        field as keyof typeof selectOptions
                                                    ]
                                                }
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid item width={230}>
                                            <TextField
                                                id={`${index}-${field}`}
                                                label={field}
                                                // value={name}
                                                // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                //     setName(event.target.value);
                                                // }}
                                                fullWidth
                                            />
                                        </Grid>
                                    )
                                )}
                            </Grid>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    pt: 2,
                                }}
                            >
                                <Button
                                    color={'inherit'}
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleNext} sx={{ mr: 1 }}>
                                    Next
                                </Button>
                                {activeStep !== fields.length &&
                                    (completed[activeStep] ? (
                                        <Typography
                                            variant="caption"
                                            sx={{ display: 'inline-block' }}
                                        >
                                            Step {activeStep + 1} already
                                            completed
                                        </Typography>
                                    ) : (
                                        <Button onClick={handleComplete}>
                                            {completedSteps() ===
                                            totalSteps() - 1
                                                ? 'Finish'
                                                : 'Complete Step'}
                                        </Button>
                                    ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    )
}

export default NewBidProposal
