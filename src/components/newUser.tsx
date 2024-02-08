import { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import RoleSelect from './RoleSelect.tsx';

type NewUserProps = {
    handleAddUser: Function;
};

const NewUser = ({ handleAddUser }: NewUserProps) => {
    const [open, setOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({
        username: undefined as string | undefined,
        first_name: undefined as string | undefined,
        last_name: undefined as string | undefined,
        created_at: undefined as string | undefined,
        updated_at: undefined as string | undefined,
        roles: undefined as [] | undefined,
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setNewUserData({ ...newUserData, [name]: value });
    };

    const handleSubmit = () => {
        handleAddUser(newUserData);
        setNewUserData({
            created_at: undefined,
            first_name: undefined,
            last_name: undefined,
            roles: [],
            updated_at: undefined,
            username: undefined,
        });
        handleClose();
    };

    return (
        <>
            <Button onClick={handleOpen}>New User</Button>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        width: 400,
                        p: 4,
                    }}
                >
                    <Typography
                        variant={'h6'}
                        fontWeight={'light'}
                        textAlign={'center'}
                        paddingBottom={2}
                    >
                        New User
                    </Typography>
                    <Stack direction={'column'} spacing={1} paddingY={1}>
                        <TextField
                            name={'username'}
                            label={'Username'}
                            value={newUserData.username || ''}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name={'first_name'}
                            label={'First Name'}
                            value={newUserData.first_name || ''}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            name={'last_name'}
                            label={'Last Name'}
                            value={newUserData.last_name || ''}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <RoleSelect />
                    </Stack>
                    <Button
                        variant={'contained'}
                        onClick={handleSubmit}
                        sx={{ marginTop: 1 }}
                        fullWidth
                    >
                        Create
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default NewUser;
