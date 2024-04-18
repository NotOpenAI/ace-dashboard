import { AttributeUpdate, Bid, CreateRequestBody } from '../types/Bid.tsx';

export const getCreateRequestBody = (bid: Bid): CreateRequestBody => {
    const requestBody: CreateRequestBody = {};

    if (bid.name) requestBody.name = bid.name;
    if (bid.bid_managers)
        requestBody.bid_manager_ids = bid.bid_managers.map(
            (manager) => manager.id
        );
    if (bid.project_managers)
        requestBody.project_manager_ids = bid.project_managers.map(
            (manager) => manager.id
        );
    if (bid.customer && bid.customer.id)
        requestBody.customer_id = bid.customer.id;
    if (bid.original_contract)
        requestBody.original_contract = bid.original_contract;
    if (bid.final_cost) requestBody.final_cost = bid.final_cost;
    if (bid.bid_status && bid.bid_status.id)
        requestBody.bid_status_id = bid.bid_status.id;
    if (bid.job_status && bid.job_status.id)
        requestBody.job_status_id = bid.job_status.id;
    if (bid.lead) requestBody.lead = bid.lead;
    if (bid.start_date) requestBody.start_date = bid.start_date;
    if (bid.finish_date) requestBody.finish_date = bid.finish_date;
    if (bid.foreman) requestBody.foreman = bid.foreman;
    if (bid.desired_margin)
        requestBody.desired_margin = bid.desired_margin / 100;

    if (bid.attributes) {
        requestBody.attributes = bid.attributes.map((attribute) => {
            const attributeUpdate: AttributeUpdate = {
                type_id: attribute.type.id,
            };
            if (attribute.option) {
                attributeUpdate.option_id = attribute.option.id;
            } else if (attribute.num_val) {
                attributeUpdate.num_val = attribute.num_val;
            }
            return attributeUpdate;
        });
    }

    return requestBody;
};
