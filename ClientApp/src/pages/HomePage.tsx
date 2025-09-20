import React, { useMemo, useState } from 'react';
import styles from './styles/HomePage.module.css';
import { useTrainingPlan } from '../context/TrainingPlanContext';
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { Box, Typography } from "@mui/material";
import PrimaryButton from '../components/base/PrimaryButton';
import TrainingPlanFormDialog from '../components/dialogs/TrainingPlanFormDialog';

const HomePage: React.FC = () => {
    const { trainingPlan } = useTrainingPlan();
    const [openTrainingPlanCreateDialog, setOpenTrainingPlanCreateDialog] = useState(false);

    const [latestRun, nextRun] = useMemo(() => {
        if (!trainingPlan?.runs || trainingPlan.runs.length === 0) return [null, null];

        const now = new Date();

        const sortedRuns = [...trainingPlan.runs].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const latest = [...sortedRuns].reverse().find(run => run.isCompleted) || null;

        const next = sortedRuns.find(run => !run.isCompleted && new Date(run.date) >= now) || null;

        return [latest, next];
    }, [trainingPlan]);

    return (
        <div className={styles.homeContainer}>
            {trainingPlan ? (
                <>
                    <h1>Running dashboard</h1>

                    {nextRun && (
                        <section className={styles.latestRunCard}>
                            <h2 className={styles.summaryTitle}>Next Run</h2>
                            <p><strong>Date:</strong> {nextRun.date}</p>
                            <p><strong>Type:</strong> {nextRun.runType}</p>
                        </section>
                    )}

                    {latestRun && (
                        <section className={styles.latestRunCard}>
                            <h2 className={styles.summaryTitle}>Last Run</h2>
                            <p><strong>Date:</strong> {latestRun.date}</p>
                            <p><strong>Type:</strong> {latestRun.runType}</p>
                            <p><strong>Distance:</strong> {latestRun.distanceKm} km</p>
                            <p><strong>Duration:</strong> {latestRun.duration}</p>
                            <p><strong>Notes:</strong> {latestRun.notes}</p>
                        </section>
                     )}
                </>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="20vh"
                >
                    <Typography variant="h4" gutterBottom>
                        Hello, let's start your running journey!
                    </Typography>
                    <PrimaryButton
                        icon={<DirectionsRunIcon />}
                        onClick={() => setOpenTrainingPlanCreateDialog(true)}
                    >
                        Create training plan
                    </PrimaryButton>
                    <TrainingPlanFormDialog
                        open={openTrainingPlanCreateDialog}
                        onClose={() => setOpenTrainingPlanCreateDialog(false)}
                        onSaved={() => {
                            console.log("Plan został zapisany – odśwież listę!");
                        }}
                    />
                </Box>
            )}

        </div>
    );
};

export default HomePage;
