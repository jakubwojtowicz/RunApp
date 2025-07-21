import React, { useCallback, useEffect, useState } from 'react';
import styles from './HomePage.module.css';

import { RunDto, RunSummary, TrainingPlanDto } from '../api/runApiTypes';
import {
    getCurrentTrainingPlan,
    getLatestRun,
    getSummary,
} from '../api/runApiCalls';

const HomePage: React.FC = () => {
    const [trainingPlan, setTrainingPlan] = useState<TrainingPlanDto | null>(null);
    const [latestRun, setLatestRun] = useState<RunDto | null>(null);
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

    const fetchLatestRun = useCallback(async (planId: number) => {
        try {
            const data = await getLatestRun(planId);
            setLatestRun(data);
        } catch (error) {
            console.error('Failed to fetch latest run:', error);
            setLatestRun(null);
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

        fetchLatestRun(trainingPlan.id);
        fetchRunSummary(trainingPlan.id);
    }, [trainingPlan, fetchLatestRun, fetchRunSummary]);

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
