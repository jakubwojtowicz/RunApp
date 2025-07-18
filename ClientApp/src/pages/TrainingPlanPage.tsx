import React, { useEffect, useState } from 'react';
import RunEntryForm from '../components/RunEntryForm';
import CompletedRunsTable from '../components/CompletedRunsTable';
import TrainingPlanForm from '../components/TrainingPlanForm';
import { RunCreateDto, RunDto, RunUpdateDto, TrainingPlanCreateDto, TrainingPlanDto } from '../types';
import styles from './TrainingPlanPage.module.css';
import UpcomingRunsTable from '../components/UpcomingRunsTable';

const TrainingPlan = () => {
    const [currentTrainingPlan, setCurrentTrainingPlan] = useState<TrainingPlanDto>();
    const [hasPlan, setHasPlan] = useState(false);
    const [showAddRunModal, setShowAddRunModal] = useState(false);
    const [upcomingRuns, setUpcomingRuns] = useState<RunDto[]>([]);
    const [completedRuns, setCompletedRuns] = useState<RunDto[]>([]);
    const [showPlanForm, setShowPlanForm] = useState(false);

    const handleAddClick = () => setShowAddRunModal(true);
    const handleCloseModal = () => setShowAddRunModal(false);

    const fetchTrainingPlan = async () => {
        try {
            const res = await fetch('https://localhost:7125/api/trainingplan/current');

            if (res.status === 404) {
                setHasPlan(false);
                return;
            }

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: TrainingPlanDto = await res.json();

            setCurrentTrainingPlan(data);
            setHasPlan(true);

        } catch (error) {
            console.error("Error fetching training plan: ", error);
        }
    };

    const fetchRuns = async () => {
        try {
            const res = await fetch(`https://localhost:7125/api/run/by-plan/${currentTrainingPlan?.id}`);
            if (!res.ok) throw new Error('Failed to fetch runs');
            const data: RunDto[] = await res.json();

            const completed = data.filter(run => run.isCompleted);
            const upcoming = data.filter(run => !run.isCompleted);

            setCompletedRuns(completed);
            setUpcomingRuns(upcoming);

        } catch (error) {
            console.error("Error fetching run entries: ",error);
        }
    };

    const handlePlanCreate = async (newEntry: TrainingPlanCreateDto) => {
        try {
            const response = await fetch('https://localhost:7125/api/trainingplan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry)
            });

            if (!response.ok) {
                throw new Error('Failed to save new run entry');
            }
            fetchTrainingPlan();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRunCreate = async (entry: RunCreateDto) => {
        if (!currentTrainingPlan) {
            console.error("No training plan selected.");
            return;
        }
        const newEntry: RunCreateDto = {
            ...entry,
            trainingPlanId: currentTrainingPlan.id
        };
        try {
            const response = await fetch('https://localhost:7125/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry)
            });

            if (!response.ok) {
                throw new Error('Failed to save new run entry');
            }

            fetchRuns();
            setShowAddRunModal(false);

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`https://localhost:7125/api/run/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete run entry');
            }

            fetchRuns();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCompleteRun = async (index: number, distanceKm: number, duration: string) => {

        const runToUpdate = upcomingRuns.find(r => r.id === index);

        if (runToUpdate !== undefined) {
            const updateEntry: RunUpdateDto = {
                id: runToUpdate.id,
                date: runToUpdate.date,
                place: runToUpdate.place,
                distanceKm: distanceKm,
                duration: duration,
                description: runToUpdate.description,
                weekNumber: runToUpdate.weekNumber,
                trainingNumberInWeek: runToUpdate.trainingNumberInWeek,
                isCompleted: true,
            };
            try {
                const response = await fetch('https://localhost:7125/api/run', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateEntry)
                });

                if (!response.ok) {
                    throw new Error('Failed to save new run entry');
                }

                fetchRuns();

            } catch (error) {
                console.error(error);
            }
        }
         else {
            console.warn(`Run with ID ${index} not found in upcomingRuns.`);
        }
    }

    useEffect(() => {
        fetchTrainingPlan();
    }, []);

    useEffect(() => {
        if (currentTrainingPlan?.id) {
            fetchRuns();
        }
    }, [currentTrainingPlan]);

    return (
        <>
            {hasPlan ? (
                <>
                    <div className={styles.planInfoBox}>
                        <h2>Current Training Plan</h2>
                        <p><strong>Name:</strong> {currentTrainingPlan?.name}</p>
                        <p><strong>Description:</strong> {currentTrainingPlan?.description}</p>
                        <p>
                            <strong>Duration:</strong> {currentTrainingPlan?.startDate} – {currentTrainingPlan?.endDate}
                        </p>
                    </div>

                    <div className={styles.centeredButtonWrapper}>
                        <button onClick={handleAddClick}>Add New Run</button>
                    </div>

                    {completedRuns.length > 0 && (
                        <>
                            <h2>Completed runs</h2>
                            <CompletedRunsTable entries={completedRuns} onDelete={handleDelete} />
                        </>
                    )}

                    {upcomingRuns.length > 0 && (
                        <>
                            <h2>Upcoming runs</h2>
                            <UpcomingRunsTable entries={upcomingRuns} onDelete={handleDelete} onCompleteRun={handleCompleteRun} />
                        </>
                    )}

                    {showAddRunModal && (
                        <div className={styles.modalBackdrop}>
                            <div className={styles.modalContent}>
                                <RunEntryForm
                                    onSave={handleRunCreate}
                                    onCancel={handleCloseModal}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                    <div className={styles.noPlanWrapper}>
                        {showPlanForm ? (
                            <TrainingPlanForm
                                onSave={handlePlanCreate}
                                onCancel={() => setShowPlanForm(false)}
                            />
                        ) : (
                            <>
                                <p className={styles.noPlanText}>You don't have an active training plan.</p>
                                <button
                                    className={styles.createPlanButton}
                                    onClick={() => setShowPlanForm(true)}
                                >
                                    Create training plan
                                </button>
                            </>
                        )}
                    </div>
            )}
        </>
    );

};

export default TrainingPlan;
