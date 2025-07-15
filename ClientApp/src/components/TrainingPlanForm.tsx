import React from 'react';
import { useState } from 'react';
import styles from './TrainingPlanForm.module.css';
import { TrainingPlanCreateDto } from '../types';

interface TrainingPlanFormProps {
    onSave: (entry: TrainingPlanCreateDto) => void;
    onCancel: () => void;
}

export default function TrainingPlanForm({ onSave, onCancel }: TrainingPlanFormProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isCurrent, setIsCurrent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !startDate || !endDate) {
            setError("Please fill all the fields.");
            return;
        }

        const newPlan: TrainingPlanCreateDto = {
            name,
            description,
            startDate,
            endDate,
            isCurrent
        };

        onSave(newPlan);
        setName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setIsCurrent(false);

    };

    return (
        <div className={styles.formWrapper}>
            <h2>Create training plan</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                {error && <p className={styles.error}>{error}</p>}

                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>

                <label>
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </label>

                <label>
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </label>

                <label className={styles.checkboxLabel}>
                    Set as current:
                    <input
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                    />
                </label>

                <div className={styles.buttonGroup}>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
