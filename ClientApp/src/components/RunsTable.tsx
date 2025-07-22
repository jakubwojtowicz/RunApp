import React, { useState } from 'react';
import { RunDto } from '../api/runApiTypes';
import styles from './RunsTable.module.css';

interface RunsTableProps {
    entries: RunDto[];
    showDate?: boolean;
    showType?: boolean;
    showWeek?: boolean;
    showNumber?: boolean;
    showDescription?: boolean;
    showDuration?: boolean;
    showDistance?: boolean;
    title?: string;
    onDelete: (index: number) => void;
    onCompleteRun?: (index: number, distanceKm: number, duration: string) => void;
}

const ITEMS_PER_PAGE = 5;

const RunsTable: React.FC<RunsTableProps> = ({
    entries,
    onDelete,
    onCompleteRun,
    title,
    showDate = true,
    showType = true,
    showWeek = true,
    showNumber = true,
    showDescription = true,
    showDuration = true,
    showDistance = true }) => {
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
        if (onCompleteRun) {
            onCompleteRun(currentRunId, typeof distanceKm === 'number' ? distanceKm : parseFloat(distanceKm), duration);
            setShowCompleteRunModal(false);
        }
    }

    return (
        <>
            <h1 className={styles.title}>{title}</h1>
            <table className={styles.runTable}>
                <thead>
                    <tr>
                        {showDate && <th>Date</th>}
                        {showType && <th>Type</th>}
                        {showWeek && <th>Week</th>}
                        {showNumber && <th>Number</th>}
                        {showDistance && <th>Distance (km)</th>}
                        {showDuration && <th>Duration</th>}
                        {showDescription && <th>Description</th>}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEntries.map((entry, idx) => (
                        <tr key={idx}>
                            {showDate && <td>{entry.date}</td>}
                            {showType && <td>{entry.place}</td>}
                            {showWeek && <td>{entry.weekNumber}</td>}
                            {showNumber && <td>{entry.trainingNumberInWeek}</td>}
                            {showDistance && <td>{entry.distanceKm.toFixed(2)}</td>}
                            {showDuration && <td>{entry.duration}</td>}
                            {showDescription && <td>{entry.description}</td>}
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
                                {onCompleteRun && (
                                    <button
                                        onClick={() => {
                                            setCurrentRunId(entry.id);
                                            setShowCompleteRunModal(true);
                                        }}
                                        className={`${styles.actionButton} ${styles.complete}`}
                                    >
                                        Complete
                                    </button>)}
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

export default RunsTable;
