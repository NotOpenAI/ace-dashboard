import { Role } from './Role.tsx';

export type User = {
    id?: number;
    username: string;
    password?: string;
    first_name: string;
    last_name: string;
    roles: Role[];
    created_at?: string;
    updated_at?: string;
};
