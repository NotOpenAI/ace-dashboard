import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FC } from 'react';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmText: string;
    confirmColor:
        | 'inherit'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'error'
        | 'info'
        | 'warning';
    title: string;
    content: string;
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    confirmText,
    confirmColor,
    title,
    content,
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth={'xs'} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color={'inherit'}>
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant={'contained'}
                    color={confirmColor}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
