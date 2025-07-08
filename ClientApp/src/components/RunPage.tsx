import React, { useEffect, useState, FormEvent } from 'react';
import './RunPage.css';

type RunEntry = {
    date: string;
    distanceKm: number;
    duration: string;
    description: string;
    weekNumber: number;
    trainingNumberInWeek: number;
};
function RunPage() {
    const [date, setDate] = useState('');
    const [distanceKm, setDistanceKm] = useState<number>(0);
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [entries, setEntries] = useState<RunEntry[]>([]);
    const [message, setMessage] = useState('');
    const [weekNumber, setWeekNumber] = useState(0);
    const [trainingNumberInWeek, setTrainingNumberInWeek] = useState(1);

    const fetchEntries = async () => {
        const res = await fetch('https://localhost:7125/api/run');
        const data: RunEntry[] = await res.json();
        setEntries(data);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const response = await fetch('https://localhost:7125/api/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, weekNumber, trainingNumberInWeek, distanceKm, duration, description}),
        });

        if (response.ok) {
            setMessage("Entry saved!");
            setDate('');
            setDistanceKm(0);
            setDuration('');
            setDescription('');
            setWeekNumber(0);
            setTrainingNumberInWeek(1);
            fetchEntries();
        } 
    };

    const handleDelete = async (index: number) => {
        try {
            const response = await fetch(`https://localhost:7125/api/run/${index}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('An error occured while removing entry.');
            }

            fetchEntries();
        } catch (error) {
            console.error(error);
            alert('Entry was not removed.');
        }
    };

    return (
        <div className="container">
            <h2>Add run</h2>
            <form onSubmit={handleSubmit} className="form">
                <label>
                    Date:
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </label>

                <label>
                    Week:
                    <input type="number" value={weekNumber} onChange={e => setWeekNumber(Number(e.target.value))} />
                </label>

                <label>
                    Number in the week:
                    <input type="number" value={trainingNumberInWeek} onChange={e => setTrainingNumberInWeek(Number(e.target.value))} />
                </label>

                <label>
                    Distance (km):
                    <input type="number" step="0.01" value={distanceKm} onChange={e => {
                        setDistanceKm(parseFloat(e.target.value.replace(',', '.')));
                    }} required />
                </label>

                <label>
                    Duration (e.g. 00:25:30):
                    <input type="text" value={duration} onChange={e => setDuration(e.target.value)} required />
                </label>

                <label>
                    Description:
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                </label>

                <button type="submit">Save</button>
            </form>

            <p className="message">{message}</p>

            <h2>Running history</h2>
            <table className="run-table">
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
                                <button onClick={() => handleDelete(idx)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RunPage;
