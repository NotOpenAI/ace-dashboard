import { Typography } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';

type RouteLinkProps = {
    to: string;
    label: string;
};

export const RouteLink = ({ to, label }: RouteLinkProps) => {
    return (
        <Typography
            variant={'body1'}
            sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                    textDecoration: 'underline',
                },
            }}
            component={RouterLink}
            to={to}
        >
            {label}
        </Typography>
    );
};
