// src/api/trainingPlanApi.ts

import { RunCreateDto, RunUpdateDto, RunDto, TrainingPlanCreateDto, TrainingPlanDto, RunSummary } from './runApiTypes';

const BASE_URL = 'https://localhost:7125/api';

export const getTrainingPlans = async (): Promise<TrainingPlanDto[]> => {
    const res = await fetch(`${BASE_URL}/training-plan/`);
    if (!res.ok) throw new Error('Failed to fetch training plan');
    return res.json();
};

export const getCurrentTrainingPlan = async (): Promise<TrainingPlanDto> => {
    const res = await fetch(`${BASE_URL}/training-plan/current`);
    if (!res.ok) throw new Error('Failed to fetch training plan');
    return res.json();
};

export const createTrainingPlan = async (plan: TrainingPlanCreateDto): Promise<void> => {
    const res = await fetch(`${BASE_URL}/training-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
    });
    if (!res.ok) throw new Error('Failed to create training plan');
};

export const getRunsForPlan = async (planId: number): Promise<RunDto[]> => {
    const res = await fetch(`${BASE_URL}/training-plan/${planId}/run`);
    if (!res.ok) throw new Error('Failed to fetch runs');
    return res.json();
};

export const createRun = async (planId: number, run: RunCreateDto): Promise<void> => {
    const res = await fetch(`${BASE_URL}/training-plan/${planId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(run),
    });
    if (!res.ok) throw new Error('Failed to create run');
};

export const updateRun = async (planId: number, run: RunUpdateDto): Promise<void> => {
    const res = await fetch(`${BASE_URL}/training-plan/${planId}/run`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(run),
    });
    if (!res.ok) throw new Error('Failed to update run');
};

export const deleteRun = async (planId: number, runId: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/training-plan/${planId}/run/${runId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete run');
};

export const getLatestRun = async (planId: number): Promise<RunDto> => {
    const res = await fetch(`https://localhost:7125/api/training-plan/${planId}/run/latest`);
    if (!res.ok) throw new Error('Failed to get latest run');
    return res.json();
};

export const getSummary = async (planId: number): Promise<RunSummary> => {
    const res = await fetch(`https://localhost:7125/api/training-plan/${planId}/run/summary`);
    if (!res.ok) throw new Error('Failed to get summary');
    return res.json();
};
