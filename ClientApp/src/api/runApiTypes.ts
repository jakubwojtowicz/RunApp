export interface RunDto {
    id: number;
    date: string;
    runType: string;
    distanceKm: number;
    duration: string;
    averageSpeed: string;
    topSpeed: string;
    minimumSpeed: string;
    notes: string;
    heartRate: number;
    isCompleted: boolean;
    trainingPlanId: number;
}

export interface RunCreateDto {
    date: string;
    runTypeId: number;
    distanceKm: number;
    duration: string;
    averageSpeed: string;
    topSpeed: string;
    minimumSpeed: string;
    notes: string;
    heartRate: number;
    isCompleted: boolean;
    trainingPlanId: number; 
}

export interface RunUpdateDto {
    id: number,
    date: string;
    distanceKm: number;
    duration: string;
    averageSpeed: string;
    topSpeed: string;
    minimumSpeed: string;
    notes: string;
    heartRate: number;
    isCompleted: boolean;
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

export interface TrainingPlanUpdateDto {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
}
