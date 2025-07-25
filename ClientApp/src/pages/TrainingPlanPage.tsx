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
    createTrainingPlan,
    getRunsForPlan,
    createRun,
    updateRun,
    deleteRun,
    getTrainingPlans,
    deleteTrainingPlan
} from '../api/runApiCalls';
import styles from './styles/TrainingPlanPage.module.css';
import RemovePrompt from '../components/RemovePrompt';

const TrainingPlan: React.FC = () => {
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlanDto[]>(); 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTrainingPlan, setCurrentTrainingPlan] = useState<TrainingPlanDto>();
    const [completedRuns, setCompletedRuns] = useState<RunDto[]>([]);
    const [upcomingRuns, setUpcomingRuns] = useState<RunDto[]>([]);
    const [showPlanForm, setShowPlanForm] = useState(false);
    const [showRunModal, setShowRunModal] = useState(false);
    const [showRemovePlanPrompt, setShowRemovePlanPrompt] = useState(false);
    
    const fetchTrainingPlans = useCallback(async () => {
        try {
            const data = await getTrainingPlans();
            setTrainingPlans(data);
            if (trainingPlans)
                setCurrentIndex(trainingPlans.findIndex(plan => plan.isCurrent));
            setCurrentTrainingPlan(data.find(t => t.isCurrent));
        } catch (err) {
            console.error(err);
            setTrainingPlans(undefined);
            setCurrentTrainingPlan(undefined);
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

    const goToPreviousPlan = () => {
        if (trainingPlans) {
            setCurrentIndex((prevIndex) => (prevIndex === 0 ? trainingPlans.length - 1 : prevIndex - 1));
        }
    };

    const goToNextPlan = () => {
        if (trainingPlans) {
            setCurrentIndex((prevIndex) => (prevIndex === trainingPlans.length - 1 ? 0 : prevIndex + 1));
        }
    };

    const handlePlanCreate = async (dto: TrainingPlanCreateDto) => {
        try {
            await createTrainingPlan(dto);
            await fetchTrainingPlans();
            setShowPlanForm(false)
        } catch (err) {
            console.error(err);
        }
    };

    const handleRunCreate = async (dto: RunCreateDto) => {
        if (!currentTrainingPlan) return;
        try {
            dto.trainingPlanId = currentTrainingPlan.id;
            await createRun(currentTrainingPlan.id, dto);
            await fetchRuns(currentTrainingPlan.id);
            setShowRunModal(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRunDelete = async (id: number) => {
        if (!currentTrainingPlan) return;
        try {
            await deleteRun(currentTrainingPlan.id, id);
            await fetchRuns(currentTrainingPlan.id);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePlanDalete = async (id: number) => {
        try {
            goToPreviousPlan();
            await deleteTrainingPlan(id);
            await fetchTrainingPlans();
            
        } catch (err) {
            console.error(err);
        }
    };

    const handleCompleteRun = async (id: number, distanceKm: number, duration: string) => {
        const run = upcomingRuns.find(r => r.id === id);
        if (!run || !currentTrainingPlan) return;
        try {
            const payload: RunUpdateDto = {
                ...run,
                distanceKm,
                duration,
                isCompleted: true,
            };
            await updateRun(currentTrainingPlan.id, payload);
            await fetchRuns(currentTrainingPlan.id);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTrainingPlans();
    }, [fetchTrainingPlans]);

    useEffect(() => {
        if (trainingPlans && trainingPlans.length > 0) {
            const selectedPlan = trainingPlans[currentIndex];
            setCurrentTrainingPlan(selectedPlan);
            fetchRuns(selectedPlan.id);
        }
    }, [currentIndex, trainingPlans, fetchRuns]);

    return (
        <>
            {trainingPlans ? (
                <>
                    <div className={styles.sliderContainer}>
                        <button className={styles.arrowButton} onClick={goToPreviousPlan}>&lt;</button>
                        <div className={styles.planCard}>
                            <h2>{trainingPlans[currentIndex].name}</h2>
                            {trainingPlans[currentIndex].isCurrent && (<h3>(Current)</h3>)}
                            <p><strong>Description:</strong> {trainingPlans[currentIndex].description}</p>
                            <p><strong>Duration:</strong> {trainingPlans[currentIndex].startDate} – {trainingPlans[currentIndex].endDate}</p>
                        </div>
                        <button className={styles.arrowButton} onClick={goToNextPlan}>&gt;</button>
                    </div>

                    <div className={styles.centeredButtonWrapper}>
                        <button onClick={() => setShowRunModal(true)}>Add Run</button>
                        <button onClick={() => setShowPlanForm(true)}>New training plan</button>
                        {!trainingPlans[currentIndex].isCurrent && (<button onClick={() => setShowRemovePlanPrompt(true)}>Remove plan</button>)}
                    </div>

                    <div className={styles.tables}>

                    {completedRuns.length > 0 && (
                            <RunsTable title={'Completed runs'} entries={completedRuns} onDelete={handleRunDelete} />
                    )}

                    {upcomingRuns.length > 0 && (
                            <RunsTable title={'Upcoming runs'} entries={upcomingRuns} onDelete={handleRunDelete} onCompleteRun={handleCompleteRun} showDistance={false} showDuration={false} />
                    )}

                    </div>

                    {showRunModal && (
                        <div className={styles.modalBackdrop}>
                            <div className={styles.modalContent}>
                                <RunEntryForm onSave={handleRunCreate} onCancel={() => setShowRunModal(false)} />
                            </div>
                        </div>
                    )}

                    {showPlanForm && (
                        <div className={styles.modalBackdrop}>
                            <div className={styles.modalContent}>
                                <TrainingPlanForm onSave={handlePlanCreate} onCancel={() => setShowPlanForm(false)} />
                            </div>
                        </div>
                    )}

                    {showRemovePlanPrompt && (
                        <RemovePrompt title={"Do you really want to remove this training plan?"} onCancel={() => setShowRemovePlanPrompt(false)} onConfirm={() => {
                            handlePlanDalete(trainingPlans[currentIndex].id);
                            setShowRemovePlanPrompt(false);
                        }} ></RemovePrompt>
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
