import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import PrimaryButton from '../components/base/PrimaryButton';
import { useTrainingPlan } from '../context/TrainingPlanContext';
import TrainingPlanFormDialog from '../components/dialogs/TrainingPlanFormDialog';

const TrainingPlan: React.FC = () => {
    const { trainingPlan } = useTrainingPlan();
    const [openTrainingPlanCreateDialog, setOpenTrainingPlanCreateDialog] = useState(false);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
        >
            <SentimentDissatisfiedIcon color="warning" sx={{ fontSize: 100, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                You don't have an active training plan
            </Typography>
            <PrimaryButton onClick={() => setOpenTrainingPlanCreateDialog(true)}>Create</PrimaryButton>
            <TrainingPlanFormDialog
                open={openTrainingPlanCreateDialog}
                onClose={() => setOpenTrainingPlanCreateDialog(false)}
                onSaved={() => {
                    console.log("Plan został zapisany – odśwież listę!");
                }}
            />
        </Box>
    );
};

export default TrainingPlan;
