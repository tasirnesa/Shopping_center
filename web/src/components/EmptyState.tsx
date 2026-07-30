import { Box, Typography, Button } from "@mui/material";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Box sx={{ fontSize: 48, mb: 2, opacity: 0.4 }}>{icon}</Box>
      <Typography
        variant="h6"
        color="text.primary"
        sx={{ fontWeight: 600 }}
        gutterBottom
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          sx={{ maxWidth: 360, mx: "auto", mb: action ? 2 : 0 }}
        >
          {description}
        </Typography>
      )}
      {action && (
        <Button variant="contained" onClick={action.onClick} sx={{ mt: 1 }}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
