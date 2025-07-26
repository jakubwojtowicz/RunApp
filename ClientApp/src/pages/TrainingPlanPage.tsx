import React, { useEffect, useState, useCallback } from 'react';
import RunEntryForm from '../components/RunEntryForm';
import TrainingPlanForm from '../components/TrainingPlanForm';
import RunsTable from '../components/RunsTable';
import RemovePrompt from '../components/RemovePrompt';
import {
    RunCreateDto, RunDto, RunUpdateDto,
    TrainingPlanCreateDto, TrainingPlanDto, TrainingPlanUpdateDto
} from '../api/runApiTypes';
import {
    createTrainingPlan, getRunsForPlan, createRun, updateRun,
    deleteRun, getTrainingPlans, deleteTrainingPlan, updateTrainingPlan
} from '../api/runApiCalls';
import styles from './styles/TrainingPlanPage.module.css';

const TrainingPlan: React.FC = () => {
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlanDto[]>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [completedRuns, setCompletedRuns] = useState<RunDto[]>([]);
    const [upcomingRuns, setUpcomingRuns] = useState<RunDto[]>([]);
    const [modalState, setModalState] = useState<'planForm' | 'runForm' | 'removePrompt' | null>(null);

    const currentPlan = trainingPlans?.[currentIndex];

    const fetchTrainingPlans = useCallback(async () => {
        try {
            const plans = await getTrainingPlans();
            setTrainingPlans(plans);
            const index = plans.findIndex(p => p.isCurrent);
            setCurrentIndex(index !== -1 ? index : 0);
        } catch (err) {
            console.error(err);
            setTrainingPlans(undefined);
        }
    }, []);

    const fetchRuns = useCallback(async (planId: number) => {
        try {
            const runs = await getRunsForPlan(planId);
            setCompletedRuns(runs.filter(r => r.isCompleted));
            setUpcomingRuns(runs.filter(r => !r.isCompleted));
        } catch (err) {
            console.error(err);
        }
    }, []);

    const refreshCurrentPlanRuns = () => currentPlan && fetchRuns(currentPlan.id);

    const handleCreate = async (type: 'plan' | 'run', dto: TrainingPlanCreateDto | RunCreateDto) => {
        try {
            if (type === 'plan') {
                await createTrainingPlan(dto as TrainingPlanCreateDto);
                await fetchTrainingPlans();
            } else if (type === 'run' && currentPlan) {
                await createRun(currentPlan.id, { ...(dto as RunCreateDto), trainingPlanId: currentPlan.id });
                await fetchRuns(currentPlan.id);
            }
            setModalState(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (type: 'plan' | 'run', id: number) => {
        try {
            if (type === 'plan') {
                await deleteTrainingPlan(id);
                await fetchTrainingPlans();
                setCurrentIndex(prev => (prev === 0 ? 0 : prev - 1));
            } else if (type === 'run' && currentPlan) {
                await deleteRun(currentPlan.id, id);
                await fetchRuns(currentPlan.id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCompleteRun = async (id: number, distanceKm: number, duration: string) => {
        const run = upcomingRuns.find(r => r.id === id);
        if (run && currentPlan) {
            try {
                const updatedRun: RunUpdateDto = { ...run, distanceKm, duration, isCompleted: true };
                await updateRun(currentPlan.id, updatedRun);
                await fetchRuns(currentPlan.id);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSetAsCurrent = async () => {
        if (currentPlan) {
            try {
                await updateTrainingPlan(currentPlan.id, { ...currentPlan, isCurrent: true });
                await fetchTrainingPlans();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const changePlanIndex = (direction: 'prev' | 'next') => {
        if (trainingPlans) {
            setCurrentIndex(prev =>
                direction === 'prev'
                    ? (prev === 0 ? trainingPlans.length - 1 : prev - 1)
                    : (prev === trainingPlans.length - 1 ? 0 : prev + 1)
            );
        }
    };

    useEffect(() => { fetchTrainingPlans(); }, [fetchTrainingPlans]);
    useEffect(() => { if (currentPlan) fetchRuns(currentPlan.id); }, [currentPlan, fetchRuns]);

    const renderModals = () => {
        switch (modalState) {
            case 'planForm':
                return (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.modalContent}>
                            <TrainingPlanForm
                                onSave={(dto) => handleCreate('plan', dto)}
                                onCancel={() => setModalState(null)}
                            />
                        </div>
                    </div>
                );
            case 'runForm':
                return (
                    <div className={styles.modalBackdrop}>
                        <div className={styles.modalContent}>
                            <RunEntryForm
                                onSave={(dto) => handleCreate('run', dto)}
                                onCancel={() => setModalState(null)}
                            />
                        </div>
                    </div>
                );
            case 'removePrompt':
                return (
                    <RemovePrompt
                        title="Do you really want to remove this training plan?"
                        onCancel={() => setModalState(null)}
                        onConfirm={() => {
                            if (currentPlan) handleDelete('plan', currentPlan.id);
                            setModalState(null);
                        }}
                    />
                );
            default:
                return null;
        }
    };

    if (!trainingPlans) {
        return (
            <div className={styles.noPlanWrapper}>
                {modalState === 'planForm' ? (
                    <TrainingPlanForm onSave={(dto) => handleCreate('plan', dto)} onCancel={() => setModalState(null)} />
                ) : (
                    <>
                        <p className={styles.noPlanText}>You don't have an active training plan.</p>
                        <button className={styles.createPlanButton} onClick={() => setModalState('planForm')}>
                            Create Training Plan
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <>
            <div className={styles.sliderContainer}>
                <button className={styles.arrowButton} onClick={() => changePlanIndex('prev')}>&lt;</button>
                <div className={styles.planCard}>
                    <h2>{currentPlan?.name}</h2>
                    {currentPlan?.isCurrent && <h3>(Current)</h3>}
                    <p><strong>Description:</strong> {currentPlan?.description}</p>
                    <p><strong>Duration:</strong> {currentPlan?.startDate} – {currentPlan?.endDate}</p>
                    <p><strong>Completed runs:</strong> {completedRuns.length}</p>
                </div>
                <button className={styles.arrowButton} onClick={() => changePlanIndex('next')}>&gt;</button>
            </div>

            <div className={styles.centeredButtonWrapper}>
                <button onClick={() => setModalState('runForm')}>Add Run</button>
                <button onClick={() => setModalState('planForm')}>New training plan</button>
                {!currentPlan?.isCurrent && (
                    <>
                        <button onClick={() => setModalState('removePrompt')}>Remove plan</button>
                        <button onClick={handleSetAsCurrent}>Set as current</button>
                    </>
                )}
            </div>

            <div className={styles.tables}>
                {completedRuns.length > 0 && (
                    <RunsTable title="Completed runs" entries={completedRuns} onDelete={(id) => handleDelete('run', id)} />
                )}
                {upcomingRuns.length > 0 && (
                    <RunsTable
                        title="Upcoming runs"
                        entries={upcomingRuns}
                        onDelete={(id) => handleDelete('run', id)}
                        onCompleteRun={handleCompleteRun}
                        showDistance={false}
                        showDuration={false}
                    />
                )}
            </div>

            {renderModals()}
        </>
    );
};

export default TrainingPlan;
