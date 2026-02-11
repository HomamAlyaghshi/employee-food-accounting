import React, { useState } from 'react';
import './App-modern.css';
import './App-dark.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

import ModernHeader from './components/ModernHeader';
import ErrorMessage from './components/ErrorMessage';
import FoodForm from './components/FoodForm';
import FoodTable from './components/FoodTable';
import EmployeeTotals from './components/EmployeeTotals';
import DetailedStats from './components/DetailedStats';
import AnalyticsPage from './components/AnalyticsPage';
import { DeleteModal } from './components/Modal';

import { useFoodItems } from './hooks/useFoodItems';
import { useItemRows } from './hooks/useItemRows';
import { useError } from './hooks/useError';
import { useModal } from './hooks/useModal';

import { calculateTotals, getEmployeeStats, calculateItemTotal } from './utils/calculations';
import { validateFoodItem } from './utils/validation';
import { exportToCSV } from './utils/export';

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [showStats, setShowStats] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    const { foodItems, addFoodItems, removeFoodItem, removeMultipleItems, updateFoodItem, clearAllFoodItems, importData } = useFoodItems();
    const { 
        itemRows, 
        updateItemRow, 
        updateItemPrice, 
        updateItemQuantity, 
        addItemRow, 
        removeItemRow, 
        resetItemRows, 
        getValidItems 
    } = useItemRows();
    const { errorMessage, showError } = useError();
    const { isModalOpen, modalData, openModal, closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedEmployee) {
            showError('Please select an employee');
            return;
        }

        const validItems = getValidItems();
        
        if (validItems.length === 0) {
            showError('Please add at least one food item');
            return;
        }

        const newItems = [];
        let hasError = false;

        for (let i = 0; i < validItems.length; i++) {
            const item = validItems[i];
            const errors = validateFoodItem(item, i);
            
            if (errors.length > 0) {
                showError(errors[0]);
                hasError = true;
                break;
            }
            
            const totalPrice = calculateItemTotal(item.quantity, item.pricePerItem);
            
            newItems.push({
                id: Date.now() + i,
                employeeName: selectedEmployee,
                foodItem: item.foodItem,
                quantity: parseInt(item.quantity),
                pricePerItem: parseFloat(item.pricePerItem),
                totalPrice
            });
        }

        if (hasError) return;

        addFoodItems(newItems);
        resetForm();
    };

    const resetForm = () => {
        setSelectedEmployee('');
        resetItemRows();
    };

    const handleExportData = () => {
        try {
            exportToCSV(foodItems);
        } catch (error) {
            showError(error.message);
        }
    };

    const handleToggleSelection = (itemId) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleBulkDelete = () => {
        openModal({
            type: 'bulk',
            itemCount: selectedItems.length,
            onConfirm: () => {
                removeMultipleItems(selectedItems);
                setSelectedItems([]);
            }
        });
    };

    const handleSingleDelete = (itemId) => {
        openModal({
            type: 'single',
            itemId,
            onConfirm: () => removeFoodItem(itemId)
        });
    };

    const handleEditItem = (item) => {
        setEditingItem(item);
    };

    const handleSaveEdit = (updatedItem) => {
        updateFoodItem(updatedItem.id, updatedItem);
        setEditingItem(null);
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
    };

    const handleClearData = () => {
        clearAllFoodItems();
        setSelectedItems([]);
    };

    const handleImportData = (data) => {
        const success = importData(data);
        if (success) {
            setSelectedItems([]);
        }
        return success;
    };

    const { employeeTotalsMap, grandTotal } = calculateTotals(foodItems);
    const employeeData = getEmployeeStats(foodItems);

    return (
        <ThemeProvider>
            <LanguageProvider>
                <div className="container">
                    <ModernHeader
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        selectedItems={selectedItems}
                        onBulkDelete={handleBulkDelete}
                        hasItems={foodItems.length > 0}
                    />
                    
                    <ErrorMessage message={errorMessage} />
                    
                    <main>
                        {currentPage === 'home' ? (
                            <>
                                <FoodForm
                                    selectedEmployee={selectedEmployee}
                                    onEmployeeChange={setSelectedEmployee}
                                    itemRows={itemRows}
                                    onUpdateItem={updateItemRow}
                                    onUpdatePrice={updateItemPrice}
                                    onUpdateQuantity={updateItemQuantity}
                                    onAddItemRow={addItemRow}
                                    onRemoveItemRow={removeItemRow}
                                    onSubmit={handleSubmit}
                                    onReset={resetForm}
                                    showRemoveButtons={itemRows.length > 1}
                                />

                                <FoodTable
                                    foodItems={foodItems}
                                    selectedItems={selectedItems}
                                    onToggleSelection={handleToggleSelection}
                                    onRemoveItem={handleSingleDelete}
                                    onEditItem={handleEditItem}
                                    editingItem={editingItem}
                                    onSaveEdit={handleSaveEdit}
                                    onCancelEdit={handleCancelEdit}
                                />

                                <EmployeeTotals
                                    employeeTotalsMap={employeeTotalsMap}
                                    grandTotal={grandTotal}
                                    onExportData={handleExportData}
                                    onToggleStats={() => setShowStats(!showStats)}
                                    showStats={showStats}
                                />

                                {showStats && (
                                    <DetailedStats employeeData={employeeData} />
                                )}
                            </>
                        ) : (
                            <AnalyticsPage foodItems={foodItems} />
                        )}
                    </main>
                    
                   
                    
                    <DeleteModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onConfirm={modalData.onConfirm}
                        itemCount={modalData.itemCount || 1}
                        itemType={modalData.type === 'bulk' ? 'items' : 'item'}
                    />
                </div>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
