import React, { useEffect, useState } from 'react';
import RunEntryForm from './RunEntryForm';
import { RunEntry } from '../types';
import RunningHistoryTable from './RunningHistoryTable';
import styles from './RunPage.module.css';


const RunPage: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [entries, setEntries] = useState<RunEntry[]>([]);

    const fetchEntries = async () => {
        try {
            const res = await fetch('https://localhost:7125/api/run');
            if (!res.ok) throw new Error('Failed to fetch runs');
            const data: RunEntry[] = await res.json();
            setEntries(data);
        } catch (error) {
            console.error(error);
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
        <div className={styles.container}>
            <button className={styles.button} onClick={() => setShowForm(prev => !prev)}>
                {showForm ? 'Hide form' : 'Add new run'}
            </button>

            {showForm && (
                <RunEntryForm onSave={handleSave} />
            )}

            <RunningHistoryTable entries={entries} onDelete={handleDelete} />
        </div>
    );
};

export default RunPage;
