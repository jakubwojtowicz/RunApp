import React, { useState } from 'react';
import { RunDto } from '../api/runApiTypes';
import styles from './CompletedRunsTable.module.css';

interface CompletedRunsTableProps {
    entries: RunDto[];
    onDelete: (index: number) => void;
}

const ITEMS_PER_PAGE = 5;

const CompletedRunsTable: React.FC<CompletedRunsTableProps> = ({ entries, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRunId, setCurrentRunId] = useState(0);
    const [showRemoveRunPrompt, setShowRemoveRunPrompt] = useState(false);
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

    return (
        <>
            <table className={styles.runTable}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Week</th>
                        <th>Number</th>
                        <th>Distance (km)</th>
                        <th>Duration</th>
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
                            <td>{entry.distanceKm.toFixed(2)}</td>
                            <td>{entry.duration}</td>
                            <td>{entry.description}</td>
                            <td className={styles.actionsCell}>
                                <button
                                    onClick={() => {
                                        setCurrentRunId(entry.id);
                                        setShowRemoveRunPrompt(true);
                                    }}
                                    className={styles.actionButton}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

            <div className={styles.pagination}>
                <button onClick={handlePrevious} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </>
    );
};

export default CompletedRunsTable;
