import React, { useState } from 'react';
import { RunDto } from '../api/runApiTypes';
import styles from './UpcomingRunsTable.module.css';

interface UpcomingRunsTableProps {
    entries: RunDto[];
    onDelete: (index: number) => void;
    onCompleteRun: (index: number, distanceKm: number, duration: string) => void;
}

const ITEMS_PER_PAGE = 5;

const UpcomingRunsTable: React.FC<UpcomingRunsTableProps> = ({ entries, onDelete, onCompleteRun }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRunId, setCurrentRunId] = useState(0);
    const [showCompleteRunModal, setShowCompleteRunModal] = useState(false);
    const [showRemoveRunPrompt, setShowRemoveRunPrompt] = useState(false);
    const [distanceKm, setDistanceKm] = useState<number | ''>('');
    const [duration, setDuration] = useState('');

    const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const totalPages = Math.ceil(sortedEntries.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentEntries = sortedEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleCompleteRun = () => {
        onCompleteRun(currentRunId, typeof distanceKm === 'number' ? distanceKm : parseFloat(distanceKm), duration);
        setShowCompleteRunModal(false);
    }

    return (
        <>
            <table className={styles.runTable}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Week</th>
                        <th>Number</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEntries.map((entry, idx) => (
                        <tr key={idx}>
                            <td>{entry.date}</td>
                            <td>{entry.place}</td>
                            <td>{entry.weekNumber}</td>
                            <td>{entry.trainingNumberInWeek}</td>
                            <td>{entry.description}</td>
                            <td className={styles.actionsCell}>
                                <button
                                    onClick={() => {
                                        setCurrentRunId(entry.id);
                                        setShowRemoveRunPrompt(true);
                                    }}
                                    className={`${styles.actionButton} ${styles.remove}`}
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentRunId(entry.id);
                                        setShowCompleteRunModal(true);
                                    }}
                                    className={`${styles.actionButton} ${styles.complete}`}
                                >
                                    Complete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                <button onClick={handlePrevious} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            {showCompleteRunModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2>Enter completed run details.</h2>
                        <form onSubmit={handleCompleteRun} className={styles.form}>

                            <label className={styles.label}>
                                Distance (km):
                                <input
                                    type="number"
                                    step="0.01"
                                    value={distanceKm}
                                    onChange={e => {
                                        const val = e.target.value.replace(',', '.');
                                        setDistanceKm(val === '' ? '' : parseFloat(val));
                                    }}
                                    required
                                    className={styles.input}
                                />
                            </label>

                            <label className={styles.label}>
                                Duration (e.g. 00:25:30):
                                <input
                                    type="text"
                                    value={duration}
                                    onChange={e => setDuration(e.target.value)}
                                    required
                                    className={styles.input}
                                    placeholder="HH:MM:SS"
                                />
                            </label>

                            <div className={styles.buttonsContainer}>

                                <button type="submit" className={styles.button}>
                                    Save
                                </button>

                                <button type="button" className={styles.button} onClick={() => setShowCompleteRunModal(false)}>
                                    Cancel
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
            {showRemoveRunPrompt && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <h2>Do you really want to remove this run entry?</h2>
                        <div className={styles.buttonsContainer}>
                            <button className={styles.button} onClick={() => {
                                onDelete(currentRunId);
                                setShowRemoveRunPrompt(false)
                            }}>
                                Yes
                            </button>

                            <button className={styles.button} onClick={() => setShowRemoveRunPrompt(false)}>
                                Cancel
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpcomingRunsTable;
