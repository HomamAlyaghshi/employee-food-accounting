import { useState, useEffect } from 'react';
import { storage, backup } from '../utils/storage';

export const useFoodItems = () => {
    const [foodItems, setFoodItems] = useState([]);

    // Load data on mount
    useEffect(() => {
        const saved = storage.load('foodItems', []);
        setFoodItems(saved);
    }, []);

    // Save data whenever it changes
    useEffect(() => {
        if (foodItems.length > 0) {
            storage.save('foodItems', foodItems);
            
            // Create automatic backup every 10 items
            if (foodItems.length % 10 === 0) {
                backup.create(foodItems, `Auto_${foodItems.length}_items`);
            }
        }
    }, [foodItems]);

    const addFoodItems = (newItems) => {
        setFoodItems(prev => [...prev, ...newItems]);
    };

    const removeFoodItem = (itemId) => {
        setFoodItems(prev => prev.filter(item => item.id !== itemId));
    };

    const removeMultipleItems = (itemIds) => {
        setFoodItems(prev => prev.filter(item => !itemIds.includes(item.id)));
    };

    const updateFoodItem = (itemId, updatedData) => {
        setFoodItems(prev => prev.map(item => 
            item.id === itemId ? { ...item, ...updatedData } : item
        ));
    };

    const clearAllFoodItems = () => {
        // Create backup before clearing
        if (foodItems.length > 0) {
            backup.create(foodItems, `Before_clear_${foodItems.length}_items`);
        }
        setFoodItems([]);
    };

    // Import data
    const importData = (data) => {
        if (Array.isArray(data)) {
            // Create backup before importing
            if (foodItems.length > 0) {
                backup.create(foodItems, `Before_import_${foodItems.length}_items`);
            }
            setFoodItems(data);
            return true;
        }
        return false;
    };

    // Export data
    const exportData = () => {
        return foodItems;
    };

    // Get storage info
    const getStorageInfo = () => {
        return storage.getStorageInfo();
    };

    return {
        foodItems,
        addFoodItems,
        removeFoodItem,
        removeMultipleItems,
        updateFoodItem,
        clearAllFoodItems,
        importData,
        exportData,
        getStorageInfo
    };
};
