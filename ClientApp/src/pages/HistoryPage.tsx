import React, { useEffect, useState } from 'react';
import RunEntryForm from '../components/RunEntryForm';
import RunningHistoryTable from '../components/RunningHistoryTable';
import { RunEntry } from '../types';
import styles from './HistoryPage.module.css';

const HistoryPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [entries, setEntries] = useState<RunEntry[]>([]);

    const handleAddClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const fetchEntries = async () => {
        try {
            const res = await fetch('https://localhost:7125/api/run');
            if (!res.ok) throw new Error('Failed to fetch runs');
            const data: RunEntry[] = await res.json();
            setEntries(data);
        } catch (error) {
            console.error("Error fetching run entries: ",error);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSave = async (newEntry: RunEntry) => {
        try {
            const response = await fetch('https://localhost:7125/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry)
            });

            if (!response.ok) {
                throw new Error('Failed to save new run entry');
            }
            fetchEntries();
            setShowModal(false);
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

            fetchEntries();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <RunningHistoryTable entries={entries} onDelete={handleDelete} />

            <div className={styles.centeredButtonWrapper}>
                <button onClick={handleAddClick}>Add New Run</button>
            </div>

            {showModal && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                        <RunEntryForm
                            onSave={handleSave}
                            onCancel={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default HistoryPage;
