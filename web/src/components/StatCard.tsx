import { Box, Paper, Typography, alpha } from "@mui/material";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: `linear-gradient(135deg, ${alpha(color, 0.1)}, ${alpha(color, 0.03)})`,
        border: `1px solid ${alpha(color, 0.2)}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(color, 0.15),
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box flex={1} minWidth={0}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
          noWrap
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800 }}
          sx={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}
        >
          {value}
        </Typography>
        {trend && (
          <Typography variant="caption" color="text.secondary">
            {trend}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
