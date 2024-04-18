import {
    Bid,
    BidAttribute,
    AttributeUpdate,
    UpdateRequestBody,
} from '../types/Bid';
import { Manager } from '../types/Role.tsx';

export const compareBids = (
    originalBid: Bid,
    updatedBid: Bid
): UpdateRequestBody => {
    const requestBody: UpdateRequestBody = {};

    // Compare each property of the bids
    if (originalBid.name !== updatedBid.name) {
        requestBody.name = updatedBid.name;
    }
    if (originalBid.lead !== updatedBid.lead) {
        requestBody.lead = updatedBid.lead;
    }
    if (originalBid.foreman !== updatedBid.foreman) {
        requestBody.foreman = updatedBid.foreman;
    }
    if (originalBid.desired_margin !== updatedBid.desired_margin) {
        requestBody.desired_margin = updatedBid.desired_margin;
    }
    if (originalBid.start_date !== updatedBid.start_date) {
        requestBody.start_date = updatedBid.start_date;
    }
    if (originalBid.finish_date !== updatedBid.finish_date) {
        requestBody.finish_date = updatedBid.finish_date;
    }
    if (originalBid.bid_status.id !== updatedBid.bid_status.id) {
        requestBody.bid_status_id = updatedBid.bid_status.id;
    }
    if (originalBid.job_status !== updatedBid.job_status) {
        requestBody.job_status_id = updatedBid.job_status.id;
    }
    if (originalBid.original_contract !== updatedBid.original_contract) {
        requestBody.original_contract = updatedBid.original_contract;
    }
    if (originalBid.final_cost !== updatedBid.final_cost) {
        requestBody.final_cost = updatedBid.final_cost;
    }

    // Compare comments
    const addedComments = updatedBid.comments.filter(
        (comment) => !originalBid.comments.includes(comment)
    );
    if (addedComments.length > 0) {
        requestBody.new_comments = addedComments;
    }

    // Compare arrays bid_manager_ids and project_manager_ids
    const originalBidManagerIds = originalBid.bid_managers.map(
        (manager: Manager) => manager.id
    );
    const updatedBidManagerIds = updatedBid.bid_managers.map(
        (manager: Manager) => manager.id
    );
    if (
        JSON.stringify(originalBidManagerIds) !==
        JSON.stringify(updatedBidManagerIds)
    ) {
        requestBody.bid_manager_ids = updatedBidManagerIds;
    }

    const originalProjectManagerIds = originalBid.project_managers.map(
        (manager: Manager) => manager.id
    );
    const updatedProjectManagerIds = updatedBid.project_managers.map(
        (manager: Manager) => manager.id
    );
    if (
        JSON.stringify(originalProjectManagerIds) !==
        JSON.stringify(updatedProjectManagerIds)
    ) {
        requestBody.project_manager_ids = updatedProjectManagerIds;
    }
    // Compare attributes
    const updatedAttributes: Partial<AttributeUpdate>[] = [];
    const originalAttributeIds = originalBid.attributes.map(
        (attribute: BidAttribute) => attribute.type.id
    );

    updatedBid.attributes.forEach((updatedAttribute: BidAttribute) => {
        const originalAttributeIndex = originalAttributeIds.indexOf(
            updatedAttribute.type.id
        );
        if (originalAttributeIndex !== -1) {
            // Attribute exists in both original and updated bids, compare them
            const originalAttribute =
                originalBid.attributes[originalAttributeIndex];
            const attributeDiff: Partial<AttributeUpdate> = {};

            if (originalAttribute.num_val !== updatedAttribute.num_val) {
                attributeDiff.num_val = updatedAttribute.num_val;
            }
            if (originalAttribute.type.id !== updatedAttribute.type.id) {
                attributeDiff.type_id = updatedAttribute.type.id;
            }
            if (
                originalAttribute.option === null &&
                updatedAttribute.option === null
            ) {
                // Handle the case where both options are null
                // Compare num_val instead
                if (originalAttribute.num_val !== updatedAttribute.num_val) {
                    attributeDiff.num_val = updatedAttribute.num_val;
                }
            } else if (
                originalAttribute.option !== null &&
                updatedAttribute.option !== null
            ) {
                // Handle the case where both options are not null
                // Compare option ids
                if (originalAttribute.option && updatedAttribute.option) {
                    if (
                        originalAttribute.option.id !==
                        updatedAttribute.option.id
                    ) {
                        attributeDiff.option_id = updatedAttribute.option.id;
                    }
                }
            } else if (
                originalAttribute.option === null &&
                updatedAttribute.option === null
            ) {
                // Handle the case where both options are null, but num_val is different
                // Compare num_val
                if (originalAttribute.num_val !== updatedAttribute.num_val) {
                    attributeDiff.num_val = updatedAttribute.num_val;
                }
            }

            if (Object.keys(attributeDiff).length > 0) {
                attributeDiff.type_id = updatedAttribute.type.id; // Add type_id
                updatedAttributes.push(attributeDiff);
            }
        } else {
            // New attribute in the updated bid, add it to updatedAttributes
            updatedAttributes.push({
                type_id: updatedAttribute.type.id,
                num_val: updatedAttribute.num_val,
                option_id: updatedAttribute.option
                    ? updatedAttribute.option.id
                    : undefined,
            });
        }
    });

    const deletedAttributes: number[] = originalBid.attributes
        .filter(
            (originalAttribute: BidAttribute) =>
                !updatedBid.attributes.some(
                    (updatedAttribute: BidAttribute) =>
                        updatedAttribute.type.id === originalAttribute.type.id
                )
        )
        .map((attribute: BidAttribute) => attribute.type.id);

    if (updatedAttributes.length > 0 || deletedAttributes.length > 0) {
        requestBody.attributes = {
            updated_attributes: updatedAttributes,
            deleted_attributes: deletedAttributes,
        };
    }

    return requestBody;
};
