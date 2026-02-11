export const validatePriceInput = (value) => {
    let cleanedValue = value.replace(/[^0-9.]/g, '');
    
    const decimalPoints = cleanedValue.match(/\./g);
    if (decimalPoints && decimalPoints.length > 1) {
        cleanedValue = cleanedValue.replace(/\.+$/, '');
    }
    
    const parts = cleanedValue.split('.');
    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        cleanedValue = parts.join('.');
    }
    
    return cleanedValue;
};

export const validateQuantityInput = (value) => {
    let cleanedValue = value.replace(/[^0-9]/g, '');
    
    if (cleanedValue && parseInt(cleanedValue) < 1) {
        cleanedValue = '1';
    }
    
    return cleanedValue;
};

export const validateFoodItem = (item, index) => {
    const errors = [];
    
    if (!item.foodItem) {
        errors.push(`Please enter a food item name for item ${index + 1}`);
    }
    
    const quantity = parseInt(item.quantity);
    if (isNaN(quantity) || quantity < 1) {
        errors.push(`Quantity must be at least 1 for item ${index + 1}`);
    }
    
    const pricePerItem = parseFloat(item.pricePerItem);
    if (isNaN(pricePerItem) || pricePerItem < 0) {
        errors.push(`Price per item must be a positive number for item ${index + 1}`);
    }
    
    return errors;
};
