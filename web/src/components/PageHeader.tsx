import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumb?: string;
}

export default function PageHeader({ title, subtitle, action, breadcrumb }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumb && (
        <Breadcrumbs sx={{ mb: 1, fontSize: '0.8125rem' }}>
          <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
            Home
          </Link>
          <Typography color="text.primary" fontSize="inherit">{breadcrumb}</Typography>
        </Breadcrumbs>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
    </Box>
  );
}
