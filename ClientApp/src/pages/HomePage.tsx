import React, { useEffect, useState } from 'react';
import { RunEntry, RunSummary } from '../types';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
    const [latestRun, setLatestRun] = useState<RunEntry | null>(null);
    const [summary, setSummary] = useState<RunSummary | null>(null);

    useEffect(() => {
        const fetchLatestRun = async () => {
            try {
                const response = await fetch('https://localhost:7125/api/run/latest');
                if (response.ok) {
                    const data = await response.json();
                    setLatestRun(data);
                }
            } catch (error) {
                console.error('Error fetching latest run:', error);
            }
        };

        const fetchSummary = async () => {
            try {
                const res = await fetch('https://localhost:7125/api/run/summary');
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data);
                }
            } catch (err) {
                console.error('Error fetching summary:', err);
            }
        };

        fetchSummary();
        fetchLatestRun();
    }, []);

    return (
        <div className={styles.homeContainer}>
            <h1>Welcome to your running dashboard!</h1>

            {summary && (
                <div className={styles.summaryCard}>
                    <h2 className={styles.summaryTitle}>Total Stats</h2>
                    <p><strong>Total Distance:</strong> {summary.totalDistance.toFixed(2)} km</p>
                    <p><strong>Total Time:</strong> {summary.totalDuration}</p>
                    <p><strong>Avg Pace:</strong> {summary.avgPace}</p>
                </div>
            )}

            {latestRun ? (
                <div className={styles.latestRunCard}>
                    <h2 className={styles.summaryTitle}>Last Run</h2>
                    <p><strong>Date:</strong> {latestRun.date}</p>
                    <p><strong>Place:</strong> {latestRun.place}</p>
                    <p><strong>Distance:</strong> {latestRun.distanceKm} km</p>
                    <p><strong>Duration:</strong> {latestRun.duration}</p>
                    <p><strong>Description:</strong> {latestRun.description}</p>
                </div>
            ) : (
                <p>Loading latest run...</p>
            )}
        </div>
    );
};

export default HomePage;
