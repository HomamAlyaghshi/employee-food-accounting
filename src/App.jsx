import React, { useState } from 'react';
import './App-modern.css';
import './App-dark.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

import ModernHeader from './components/ModernHeader';
import ErrorMessage from './components/ErrorMessage';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import FoodTable from './components/FoodTable';
import EmployeeTotals from './components/EmployeeTotals';
import DetailedStats from './components/DetailedStats';
import AnalyticsPage from './components/AnalyticsPage';
import { DeleteModal } from './components/Modal';

import { useOrders } from './hooks/useOrders';
import { useError } from './hooks/useError';
import { useModal } from './hooks/useModal';

import { calculateTotals, getEmployeeStats } from './utils/calculations';
import { exportToCSV } from './utils/export';

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [showStats, setShowStats] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

    const { orders, createOrder, updateOrder, deleteOrder, clearAllOrders, getAllFoodItems } = useOrders();
    const { errorMessage, showError } = useError();
    const { isModalOpen, modalData, openModal, closeModal } = useModal();

    const allFoodItems = getAllFoodItems();

    const handleCreateOrder = (orderData) => {
        try {
            if (editingOrder) {
                updateOrder(editingOrder.id, orderData);
                setEditingOrder(null);
            } else {
                createOrder(orderData);
            }
            setShowOrderForm(false);
        } catch (error) {
            showError('Failed to save order: ' + error.message);
        }
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setShowOrderForm(true);
    };

    const handleDeleteOrder = (orderId) => {
        openModal({
            type: 'deleteOrder',
            orderName: orders.find(o => o.id === orderId)?.name || 'Unknown',
            onConfirm: () => {
                deleteOrder(orderId);
            }
        });
    };

    const handleViewOrder = (order) => {
        setEditingOrder(order);
        setIsViewMode(true);
        setShowOrderForm(true);
    };

    const handleCreateNewOrder = () => {
        setEditingOrder(null);
        setIsViewMode(false);
        setShowOrderForm(true);
    };

    const handleCancelOrderForm = () => {
        setShowOrderForm(false);
        setEditingOrder(null);
        setIsViewMode(false);
    };

    const handleExportData = () => {
        try {
            exportToCSV(allFoodItems);
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
                setSelectedItems([]);
            }
        });
    };

    const handleClearData = () => {
        clearAllOrders();
        setSelectedItems([]);
    };

    const handleImportData = (data) => {
        // Handle import if needed
        return true;
    };

    const { employeeTotalsMap, grandTotal, employeeDeliveryFees } = calculateTotals(allFoodItems);
    const employeeData = getEmployeeStats(allFoodItems);

    return (
        <ThemeProvider>
            <LanguageProvider>
                <div className="container">
                    <ModernHeader
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        selectedItems={selectedItems}
                        onBulkDelete={handleBulkDelete}
                        hasItems={orders.length > 0}
                    />
                    
                    <ErrorMessage message={errorMessage} />
                    
                    <main>
                        {currentPage === 'home' ? (
                            <>
                                {showOrderForm ? (
                                    <OrderForm
                                        onCreateOrder={handleCreateOrder}
                                        onReset={handleCancelOrderForm}
                                        currentOrder={editingOrder}
                                        isViewMode={isViewMode}
                                    />
                                ) : (
                                    <OrderList
                                        orders={orders}
                                        onEditOrder={handleEditOrder}
                                        onDeleteOrder={handleDeleteOrder}
                                        onViewOrder={handleViewOrder}
                                        onCreateNewOrder={handleCreateNewOrder}
                                    />
                                )}

                                <FoodTable
                                    foodItems={allFoodItems}
                                    selectedItems={selectedItems}
                                    onToggleSelection={handleToggleSelection}
                                />

                                <EmployeeTotals
                                    employeeTotalsMap={employeeTotalsMap}
                                    grandTotal={grandTotal}
                                    employeeDeliveryFees={employeeDeliveryFees}
                                    onExportData={handleExportData}
                                    onToggleStats={() => setShowStats(!showStats)}
                                    showStats={showStats}
                                />

                                {showStats && (
                                    <DetailedStats employeeData={employeeData} />
                                )}
                            </>
                        ) : (
                            <AnalyticsPage foodItems={allFoodItems} />
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
