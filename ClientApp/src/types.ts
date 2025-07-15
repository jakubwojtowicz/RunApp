export interface RunDto {
    id: number;
    date: string;
    place: 'Outdoor' | 'Treadmill';
    distanceKm: number;
    duration: string;
    description: string;
    weekNumber: number;
    trainingNumberInWeek: number;
    isCompleted: boolean;
    trainingPlanId: number;
}

export interface RunCreateDto {
    date: string;
    place: 'Outdoor' | 'Treadmill';
    distanceKm: number;
    duration: string;
    description: string;
    weekNumber: number;
    trainingNumberInWeek: number;
    isCompleted: boolean;
    trainingPlanId: number; 
}

export interface TrainingPlanDto {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    runs: RunDto[];
}

export interface TrainingPlanCreateDto {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}

export interface RunSummary {
    totalDistance: number;
    totalDuration: string;
    avgPace: string;
}