import { Customer } from './Customer.tsx';
import { Manager } from './Role.tsx';

export type Bid = {
    name: string;
    id?: number;
    bid_status: Status;
    job_status: Status;
    bid_managers: Manager[];
    project_managers: Manager[];
    lead: string;
    foreman: string;
    customer: Customer;
    start_date: string;
    finish_date: string;
    original_contract: number;
    final_cost: number;
    desired_margin: number;
    actual_margin: number;
    attributes: BidAttribute[];
    comments: string[];
    created_at: string;
    updated_at: string;
};

export type BidAttribute = {
    num_val: number;
    type: AttributeType;
    option?: AttributeOption;
    created_at?: string;
    updated_at?: string;
};

export type Attribute = {
    name: string;
    id: number;
    active: boolean;
    required: boolean;
    options: AttributeOption[];
    num_val: string;
    type: AttributeType;
    option: AttributeOption;
};

export type AttributeUpdate = {
    num_val?: number;
    type_id: number;
    option_id?: number;
};

export type AttributeOption = {
    value: string;
    id: number;
    active?: boolean;
};

export type AttributeType = {
    id: number;
    name: string;
};

export type Status = {
    id: number;
    value: string;
};

export const bidStatusOptions: Status[] = [
    {
        id: 1,
        value: 'New',
    },
    {
        id: 2,
        value: 'Rejected',
    },
    {
        id: 3,
        value: 'Accepted',
    },
];

export type UpdateRequestBody = {
    name?: string;
    lead?: string;
    bid_manager_ids?: number[];
    project_manager_ids?: number[];
    foreman?: string;
    desired_margin?: number;
    start_date?: string;
    finish_date?: string;
    bid_status_id?: number;
    job_status_id?: number;
    original_contract?: number;
    new_comments?: string[];
    final_cost?: number;
    attributes?: {
        updated_attributes?: Partial<AttributeUpdate>[];
        deleted_attributes?: number[];
    };
};
