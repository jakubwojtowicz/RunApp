import { Button } from "@mui/material";
import { SxProps, Theme } from "@mui/material";
import React from "react";

interface PrimaryButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
}

const buttonStyle: SxProps<Theme> = {
    mt: 3,
    background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
    color: "#fff",
    fontWeight: "bold",
    padding: "12px 24px",
    borderRadius: 3
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick, icon }) => (
    <Button
        variant="contained"
        size="large"
        sx={buttonStyle}
        onClick={onClick}
        startIcon={icon ? icon : undefined}
    >
        {children}
    </Button>
);

export default PrimaryButton;
