import { useState } from 'react';
import { validatePriceInput, validateQuantityInput } from '../utils/validation';

export const useItemRows = () => {
    const [itemRows, setItemRows] = useState([
        { id: 1, foodItem: '', quantity: '', pricePerItem: '' }
    ]);

    const updateItemRow = (itemId, field, value) => {
        setItemRows(prev => prev.map(row => 
            row.id === itemId ? { ...row, [field]: value } : row
        ));
    };

    const updateItemPrice = (itemId, value) => {
        const cleanedValue = validatePriceInput(value);
        updateItemRow(itemId, 'pricePerItem', cleanedValue);
    };

    const updateItemQuantity = (itemId, value) => {
        const cleanedValue = validateQuantityInput(value);
        updateItemRow(itemId, 'quantity', cleanedValue);
    };

    const addItemRow = () => {
        const newId = Math.max(...itemRows.map(row => row.id)) + 1;
        setItemRows(prev => [...prev, { 
            id: newId, 
            foodItem: '', 
            quantity: '', 
            pricePerItem: '' 
        }]);
    };

    const removeItemRow = (itemId) => {
        if (itemRows.length > 1) {
            setItemRows(prev => prev.filter(row => row.id !== itemId));
        }
    };

    const resetItemRows = () => {
        setItemRows([{ id: 1, foodItem: '', quantity: '', pricePerItem: '' }]);
    };

    const getValidItems = () => {
        return itemRows.filter(row => row.foodItem || row.quantity || row.pricePerItem);
    };

    return {
        itemRows,
        updateItemRow,
        updateItemPrice,
        updateItemQuantity,
        addItemRow,
        removeItemRow,
        resetItemRows,
        getValidItems
    };
};
