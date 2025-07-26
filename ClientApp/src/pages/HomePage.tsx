import React, { useCallback, useEffect, useState } from 'react';
import styles from './styles/HomePage.module.css';

import { RunDto, RunSummary, TrainingPlanDto } from '../api/runApiTypes';
import {
    getCurrentTrainingPlan,
    getRunsForPlan,
    getSummary,
} from '../api/runApiCalls';

const HomePage: React.FC = () => {
    const [trainingPlan, setTrainingPlan] = useState<TrainingPlanDto | null>(null);
    const [latestRun, setLatestRun] = useState<RunDto | null>(null);
    const [nextRun, setNextRun] = useState<RunDto | null>(null);
    const [summary, setSummary] = useState<RunSummary | null>(null);

    const fetchTrainingPlan = useCallback(async () => {
        try {
            const data = await getCurrentTrainingPlan();
            setTrainingPlan(data);
        } catch (error) {
            console.error('Failed to fetch training plan:', error);
            setTrainingPlan(null);
        }
    }, []);

    const fetchRuns = useCallback(async (planId: number) => {
        try {
            const data = await getRunsForPlan(planId);

            const completedRuns = data.filter(run => run.isCompleted);
            const latestCompletedRun = completedRuns.reduce((latest, current) => {
                return new Date(current.date) > new Date(latest.date) ? current : latest;
            }, completedRuns[0]);

            const upcomingRuns = data.filter(run => !run.isCompleted);
            const today = new Date();
            const nextUpcomingRun = upcomingRuns.reduce((closest, current) => {
                const currentDiff = Math.abs(new Date(current.date).getTime() - today.getTime());
                const closestDiff = Math.abs(new Date(closest.date).getTime() - today.getTime());
                return currentDiff < closestDiff ? current : closest;
            }, upcomingRuns[0]);

            setLatestRun(latestCompletedRun || null);
            setNextRun(nextUpcomingRun || null);

        } catch (error) {
            console.error('Failed to fetch runs:', error);
            setLatestRun(null);
            setNextRun(null);
        }
    }, []);


    const fetchRunSummary = useCallback(async (planId: number) => {
        try {
            const data = await getSummary(planId);
            setSummary(data);
        } catch (error) {
            console.error('Failed to fetch run summary:', error);
            setSummary(null);
        }
    }, []);

    useEffect(() => {
        fetchTrainingPlan();
    }, [fetchTrainingPlan]);

    useEffect(() => {
        if (!trainingPlan?.id) return;

        fetchRuns(trainingPlan.id);
        fetchRunSummary(trainingPlan.id);
    }, [trainingPlan, fetchRuns, fetchRunSummary]);

    return (
        <div className={styles.homeContainer}>
            <h1>Welcome to your running dashboard!</h1>

            {summary && (
                <section className={styles.summaryCard}>
                    <h2 className={styles.summaryTitle}>Total Stats</h2>
                    <p><strong>Total Distance:</strong> {summary.totalDistance.toFixed(2)} km</p>
                    <p><strong>Total Time:</strong> {summary.totalDuration}</p>
                    <p><strong>Avg Pace:</strong> {summary.avgPace}</p>
                </section>
            )}

            {nextRun && (
                <section className={styles.latestRunCard}>
                    <h2 className={styles.summaryTitle}>Next Run</h2>
                    <p><strong>Date:</strong> {nextRun.date}</p>
                    <p><strong>Type:</strong> {nextRun.place}</p>
                    <p><strong>Description:</strong> {nextRun.description}</p>
                </section>
            )}

            {latestRun && (
                <section className={styles.latestRunCard}>
                    <h2 className={styles.summaryTitle}>Last Run</h2>
                    <p><strong>Date:</strong> {latestRun.date}</p>
                    <p><strong>Type:</strong> {latestRun.place}</p>
                    <p><strong>Distance:</strong> {latestRun.distanceKm} km</p>
                    <p><strong>Duration:</strong> {latestRun.duration}</p>
                    <p><strong>Description:</strong> {latestRun.description}</p>
                </section>
            )}

        </div>
    );
};

export default HomePage;
