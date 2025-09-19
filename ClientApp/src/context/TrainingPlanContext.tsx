import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentTrainingPlan } from "../api/runApiCalls";
import { TrainingPlanDto } from "../api/runApiTypes";

type TrainingContextType = {
    trainingPlan: TrainingPlanDto | null;
    refreshData: () => void;
};

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [trainingPlan, setTrainingPlan] = useState<TrainingPlanDto | null>(null);

    const fetchData = async () => {
        try {
            const planRes = await getCurrentTrainingPlan();
            setTrainingPlan(planRes);
        } catch (err) {
            console.error("Error occured while fetching current training plan.", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <TrainingContext.Provider value={{ trainingPlan, refreshData: fetchData }}>
            {children}
        </TrainingContext.Provider>
    );
};

export const useTrainingPlan = () => {
    const ctx = useContext(TrainingContext);
    if (!ctx) throw new Error("useTraining must be used inside TrainingProvider");
    return ctx;
};
