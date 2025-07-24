import React, { useState } from 'react';
import styles from './styles/Form.module.css';
import { RunCreateDto } from '../api/runApiTypes';

interface RunEntryFormProps {
    onSave: (entry: RunCreateDto) => void;
    onCancel: () => void;
}

const RunEntryForm: React.FC<RunEntryFormProps> = ({ onSave, onCancel }) => {
    const [date, setDate] = useState('');
    const [place, setPlace] = useState<'Outdoor' | 'Treadmill'>('Treadmill');
    const [weekNumber, setWeekNumber] = useState<number | ''>('');
    const [trainingNumberInWeek, setTrainingNumberInWeek] = useState<number | ''>('');
    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !description) {
            setMessage('Please fill in required fields');
            return;
        }

        const entry: RunCreateDto = {
            date,
            place,
            distanceKm: distanceKm,
            duration: duration === '' ? null : duration,
            description,
            weekNumber: weekNumber === '' ? 0 : weekNumber,
            trainingNumberInWeek: trainingNumberInWeek === '' ? 0 : trainingNumberInWeek,
            isCompleted,
            trainingPlanId: 0
        };

        onSave(entry);

        setDate('');
        setWeekNumber('');
        setTrainingNumberInWeek('');
        setDistanceKm(null);
        setDuration('');
        setDescription('');
        setPlace('Treadmill');
    };

    const handleChangePlace = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlace(e.target.value as 'Outdoor' | 'Treadmill');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Create new run</h2>
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
                Place:
                <select value={place} onChange={handleChangePlace} className={styles.select}>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Treadmill">Treadmill</option>
                </select>
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
                    value={distanceKm !== null ? distanceKm : ''}
                    onChange={e => {
                        const val = e.target.value;
                        setDistanceKm(val === '' ? null : parseFloat(val));
                    }}
                    className={styles.input}
                />
            </label>

            <label className={styles.label}>
                Duration (e.g. 00:25:30):
                <input
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
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

            <label className={styles.label}>
                Completed:
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={e => setIsCompleted(e.target.checked)}
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

            <p className={styles.message}>{message}</p>
        </form>
    );
};

export default RunEntryForm;
