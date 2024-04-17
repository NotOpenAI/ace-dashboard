import {
    Attribute,
    AttributeComparisonResult,
    AttributeOption,
} from '../types/Bid.tsx';

export const compareAttributes = (
    oldAttribute: Attribute,
    newAttribute: Attribute
): AttributeComparisonResult => {
    const updateOptions: AttributeOption[] = [];
    const deleteOptions: number[] = [];

    // Compare options
    oldAttribute.options.forEach((oldOption) => {
        const correspondingNewOption = newAttribute.options.find(
            (option) => option.id === oldOption.id
        );
        if (!correspondingNewOption) {
            deleteOptions.push(oldOption.id);
        } else if (
            correspondingNewOption.value !== oldOption.value ||
            correspondingNewOption.active !== oldOption.active
        ) {
            updateOptions.push(correspondingNewOption);
        }
    });

    newAttribute.options.forEach((newOption) => {
        if (
            !oldAttribute.options.find((option) => option.id === newOption.id)
        ) {
            updateOptions.push(newOption);
        }
    });

    return {
        options: {
            update_options: updateOptions,
            delete_options: deleteOptions,
        },
        active: oldAttribute.active,
        required: oldAttribute.required,
    };
};
