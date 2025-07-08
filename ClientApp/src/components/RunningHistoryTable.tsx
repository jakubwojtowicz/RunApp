import React from 'react';
import { RunEntry } from '../types';
import styles from './RunningHistoryTable.module.css';

interface RunningHistoryTableProps {
    entries: RunEntry[];
    onDelete: (index: number) => void;
}

const RunningHistoryTable: React.FC<RunningHistoryTableProps> = ({ entries, onDelete }) => {
    return (
        <>
        <h2>Running history</h2>
        <table className={styles.runTable}>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Week</th>
                    <th>Number</th>
                    <th>Distance (km)</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {entries.map((entry, idx) => (
                    <tr key={idx}>
                        <td>{entry.date}</td>
                        <td>{entry.weekNumber}</td>
                        <td>{entry.trainingNumberInWeek}</td>
                        <td>{entry.distanceKm.toFixed(2)}</td>
                        <td>{entry.duration}</td>
                        <td>{entry.description}</td>
                        <td>
                            <button
                                onClick={() => onDelete(idx)}
                                className={styles.actionButton}
                            >
                                Remove
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </>
    );
};

export default RunningHistoryTable;
