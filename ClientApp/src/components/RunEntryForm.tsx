import React, { useState } from 'react';
import styles from './RunEntryForm.module.css';
import { RunEntry } from '../types';

interface RunEntryFormProps {
    onSave: (entry: RunEntry) => void;
    onCancel: () => void;
}

const RunEntryForm: React.FC<RunEntryFormProps> = ({ onSave, onCancel }) => {
    const [date, setDate] = useState('');
    const [weekNumber, setWeekNumber] = useState<number | ''>('');
    const [trainingNumberInWeek, setTrainingNumberInWeek] = useState<number | ''>('');
    const [distanceKm, setDistanceKm] = useState<number | ''>('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !distanceKm || !duration) {
            setMessage('Please fill in required fields');
            return;
        }

        const entry: RunEntry = {
            date,
            weekNumber: weekNumber === '' ? 0 : weekNumber,
            trainingNumberInWeek: trainingNumberInWeek === '' ? 0 : trainingNumberInWeek,
            distanceKm: typeof distanceKm === 'number' ? distanceKm : parseFloat(distanceKm),
            duration,
            description,
        };

        onSave(entry);
        setMessage('Run saved!');

        // Optionally reset form
        setDate('');
        setWeekNumber('');
        setTrainingNumberInWeek('');
        setDistanceKm('');
        setDuration('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
                Date:
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                Week:
                <input
                    type="number"
                    value={weekNumber}
                    onChange={e => setWeekNumber(e.target.value === '' ? '' : Number(e.target.value))}
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                Number in the week:
                <input
                    type="number"
                    value={trainingNumberInWeek}
                    onChange={e => setTrainingNumberInWeek(e.target.value === '' ? '' : Number(e.target.value))}
                    className={styles.input}
                />
            </label>

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

            <label className={styles.label}>
                Description:
                <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={styles.input}
                />
            </label>

            <div className={styles.buttonsContainer}>

                <button type="submit" className={styles.button}>
                    Save
                </button>

                <button type="button" className={styles.button} onClick={onCancel}>
                    Cancel
                </button>

            </div>

            <p className={styles.message}>{message}</p>
        </form>
    );
};

export default RunEntryForm;
