import React, { useState } from 'react';
import './App-modern.css';
import './App-dark.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

import ModernHeader from './components/ModernHeader';
import ErrorMessage from './components/ErrorMessage';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import FoodTable from './components/FoodTable';
import EmployeeTotals from './components/EmployeeTotals';
import DetailedStats from './components/DetailedStats';
import AnalyticsPage from './components/AnalyticsPage';
import { DeleteModal } from './components/Modal';
import EmployeeManager from './components/EmployeeManager';

import { useOrders } from './hooks/useOrders';
import { useError } from './hooks/useError';
import { useModal } from './hooks/useModal';

import { calculateTotals, getEmployeeStats } from './utils/calculations';
import { exportToCSV } from './utils/export';

const AppContent = () => {
    const { t } = useLanguage();
    const [currentPage, setCurrentPage] = useState('employees');
    const [showStats, setShowStats] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [editingOrder, setEditingOrder] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);

    const { orders, createOrder, updateOrder, deleteOrder, clearAllOrders, getAllFoodItems } = useOrders();
    const { errorMessage, showError } = useError();
    const { isModalOpen, modalData, openModal, closeModal } = useModal();

    const allFoodItems = getAllFoodItems();

    const handleEmployeesUpdated = (updatedEmployees) => {
        // Update localStorage for OrderForm to use
        localStorage.setItem('customEmployees', JSON.stringify(updatedEmployees));
    };
    

    const handleProceedToOrders = () => {
        setCurrentPage('home');
    };

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
            showError(t('failedToSaveOrder') + error.message);
        }
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setShowOrderForm(true);
    };

    const handleDeleteOrder = (orderId) => {
        openModal({
            type: 'deleteOrder',
            orderName: orders.find(o => o.id === orderId)?.name || t('unknown'),
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

    const { employeeTotalsMap, grandTotal, employeeDeliveryFees } = calculateTotals(allFoodItems);
    const employeeData = getEmployeeStats(allFoodItems);

    return (
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
                {currentPage === 'employees' ? (
                    <EmployeeManager
                        onEmployeesUpdated={handleEmployeesUpdated}
                        onProceedToOrders={handleProceedToOrders}
                    />
                ) : currentPage === 'home' ? (
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
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
