import React from 'react';
import { useState } from 'react';
import styles from './styles/Form.module.css';
import { TrainingPlanCreateDto } from '../api/runApiTypes';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !startDate || !endDate) {
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
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Create new training plan</h2>
            <label className={styles.label}>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                Description:
                <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                Start Date:
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                End Date:
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                Set as current:
                <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={e => setIsCurrent(e.target.checked)}
                    className={styles.checkbox}
                />
            </label>

            <div className={styles.buttonsContainer}>

                <button type="submit" className={`${styles.button} ${styles.save}`}>
                    Save
                </button>

                <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={onCancel}>
                    Cancel
                </button>

            </div>

        </form>
    );
}
