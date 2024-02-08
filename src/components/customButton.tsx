import { FC, MouseEventHandler, ReactNode } from 'react';
import { Button } from '@mui/material';

interface CustomButtonProps {
    color:
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'error'
        | 'info'
        | 'warning';
    label: string;
    icon?: ReactNode;
    onClick?: MouseEventHandler;
    fullWidth?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({
    color,
    label,
    icon,
    onClick,
    fullWidth,
}) => {
    return (
        <Button
            startIcon={icon}
            color={color}
            variant={'outlined'}
            sx={{ height: 56 }}
            onClick={onClick}
            fullWidth={fullWidth}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
