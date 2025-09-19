import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles/HomePage.module.css';
import { useTrainingPlan } from '../context/TrainingPlanContext';
import { RunDto } from '../api/runApiTypes';

const HomePage: React.FC = () => {
    const { trainingPlan } = useTrainingPlan();

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

        </div>
    );
};

export default HomePage;
