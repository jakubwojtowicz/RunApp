import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";
import { TrainingPlanCreateDto } from "../../api/runApiTypes";
import React from "react";
import { createTrainingPlan } from "../../api/runApiCalls";

interface Props {
    open: boolean;
    onClose: () => void;
    onSaved?: () => void; 
}

export default function TrainingPlanFormDialog({ open, onClose, onSaved }: Props) {
    const [formData, setFormData] = useState<TrainingPlanCreateDto>({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        isCurrent: true,
    });

    const handleChange = (field: keyof TrainingPlanCreateDto, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        createTrainingPlan(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>New training plan</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        minRows={3}
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                    <TextField
                        label="Start date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={(e) => handleChange("startDate", e.target.value)}
                    />
                    <TextField
                        label="End date"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate}
                        onChange={(e) => handleChange("endDate", e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={onSaved} type="submit" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
