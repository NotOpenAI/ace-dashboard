export type Customer = {
    id?: number;
    name: string;
    owner?: string;
    market?: string;
    reputation?: string;
    fin_health?: string;
    contacts?: Contact[];
    created_at?: string;
    updated_at?: string;
};

export type Contact = {
    id?: number;
    name: string;
    email: string;
    phone: string;
};
