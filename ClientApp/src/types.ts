export interface RunEntry {
    date: string;
    place: 'Outdoor' | 'Treadmill';
    weekNumber: number;
    trainingNumberInWeek: number;
    distanceKm: number;
    duration: string;
    description: string;
}
export interface RunSummary {
    totalDistance: number;
    totalDuration: string;
    avgPace: string;
}