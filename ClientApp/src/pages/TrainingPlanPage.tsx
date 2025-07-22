// TrainingPlan.tsx
import React, { useEffect, useState, useCallback } from 'react';
import RunEntryForm from '../components/RunEntryForm';
import TrainingPlanForm from '../components/TrainingPlanForm';
import RunsTable from '../components/RunsTable';
import {
    RunCreateDto, RunDto, RunUpdateDto,
    TrainingPlanCreateDto, TrainingPlanDto
} from '../api/runApiTypes';
import {
    getCurrentTrainingPlan,
    createTrainingPlan,
    getRunsForPlan,
    createRun,
    updateRun,
    deleteRun
} from '../api/runApiCalls';
import styles from './TrainingPlanPage.module.css';

const TrainingPlan: React.FC = () => {
    const [trainingPlan, setTrainingPlan] = useState<TrainingPlanDto>();
    const [completedRuns, setCompletedRuns] = useState<RunDto[]>([]);
    const [upcomingRuns, setUpcomingRuns] = useState<RunDto[]>([]);
    const [showPlanForm, setShowPlanForm] = useState(false);
    const [showRunModal, setShowRunModal] = useState(false);

    const fetchTrainingPlan = useCallback(async () => {
        try {
            const data = await getCurrentTrainingPlan();
            setTrainingPlan(data);
        } catch (err) {
            console.error(err);
            setTrainingPlan(undefined);
        }
    }, []);

    const fetchRuns = useCallback(async (planId: number) => {
        try {
            const data = await getRunsForPlan(planId);
            setCompletedRuns(data.filter(r => r.isCompleted));
            setUpcomingRuns(data.filter(r => !r.isCompleted));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const handlePlanCreate = async (dto: TrainingPlanCreateDto) => {
        try {
            await createTrainingPlan(dto);
            await fetchTrainingPlan();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRunCreate = async (dto: RunCreateDto) => {
        if (!trainingPlan) return;
        try {
            dto.trainingPlanId = trainingPlan.id;
            await createRun(trainingPlan.id, dto);
            await fetchRuns(trainingPlan.id);
            setShowRunModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!trainingPlan) return;
        try {
            await deleteRun(trainingPlan.id, id);
            await fetchRuns(trainingPlan.id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCompleteRun = async (id: number, distanceKm: number, duration: string) => {
        const run = upcomingRuns.find(r => r.id === id);
        if (!run || !trainingPlan) return;
        try {
            const payload: RunUpdateDto = {
                ...run,
                distanceKm,
                duration,
                isCompleted: true,
            };
            await updateRun(trainingPlan.id, payload);
            await fetchRuns(trainingPlan.id);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTrainingPlan();
    }, [fetchTrainingPlan]);

    useEffect(() => {
        if (trainingPlan?.id) {
            fetchRuns(trainingPlan.id);
        }
    }, [trainingPlan, fetchRuns]);

    return (
        <>
            {trainingPlan ? (
                <>
                    <section className={styles.planInfoBox}>
                        <h2>Current Training Plan</h2>
                        <p><strong>Name:</strong> {trainingPlan.name}</p>
                        <p><strong>Description:</strong> {trainingPlan.description}</p>
                        <p><strong>Duration:</strong> {trainingPlan.startDate} – {trainingPlan.endDate}</p>
                    </section>

                    <div className={styles.centeredButtonWrapper}>
                        <button onClick={() => setShowRunModal(true)}>Add New Run</button>
                    </div>

                    <div className={styles.tables}>

                    {completedRuns.length > 0 && (
                            <RunsTable title={'Completed runs'} entries={completedRuns} onDelete={handleDelete} />
                    )}

                    {upcomingRuns.length > 0 && (
                            <RunsTable title={'Upcoming runs'} entries={upcomingRuns} onDelete={handleDelete} onCompleteRun={handleCompleteRun} showDistance={false} showDuration={false} />
                    )}

                    </div>

                    {showRunModal && (
                        <div className={styles.modalBackdrop}>
                            <div className={styles.modalContent}>
                                <RunEntryForm onSave={handleRunCreate} onCancel={() => setShowRunModal(false)} />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.noPlanWrapper}>
                    {showPlanForm ? (
                        <TrainingPlanForm onSave={handlePlanCreate} onCancel={() => setShowPlanForm(false)} />
                    ) : (
                        <>
                            <p className={styles.noPlanText}>You don't have an active training plan.</p>
                            <button className={styles.createPlanButton} onClick={() => setShowPlanForm(true)}>
                                Create Training Plan
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default TrainingPlan;
