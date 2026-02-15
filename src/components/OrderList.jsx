import React, { useState } from 'react';
import { Edit3, Trash2, Eye, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const OrderList = ({ 
    orders, 
    onEditOrder, 
    onDeleteOrder, 
    onViewOrder,
    onCreateNewOrder 
}) => {
    const { t } = useLanguage();
    const [expandedOrders, setExpandedOrders] = useState(new Set());

    const toggleOrderExpansion = (orderId) => {
        const newExpanded = new Set(expandedOrders);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedOrders(newExpanded);
    };

    const calculateOrderTotals = (order) => {
        const subtotal = order.employees?.reduce((sum, employee) => {
            if (employee.employeeId) {
                const employeeSubtotal = employee.products?.reduce((empSum, product) => empSum + (product.totalPrice || 0), 0) || 0;
                return sum + employeeSubtotal;
            }
            return sum;
        }, 0) || 0;
        
        const uniqueEmployees = order.employees?.filter(emp => emp.employeeId) || [];
        const deliveryFeePerEmployee = uniqueEmployees.length > 0 ? (order.deliveryFee || 0) / uniqueEmployees.length : 0;
        const total = subtotal + (order.deliveryFee || 0);
        
        return { 
            subtotal, 
            deliveryFeePerEmployee, 
            total, 
            uniqueEmployees 
        };
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="card order-list">
            <div className="order-list-header">
                <h2>{t('orders')}</h2>
                <button className="btn btn-primary" onClick={onCreateNewOrder}>
                    <Plus size={16} />
                    {t('newOrder')}
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>{t('noOrdersYet')}</p>
                </div>
            ) : (
                <div className="orders-container">
                    {orders.map(order => {
                        const totals = calculateOrderTotals(order);
                        const isExpanded = expandedOrders.has(order.id);
                        
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-info">
                                        <h3>{order.name}</h3>
                                        <p className="order-date">{formatDate(order.timestamp)}</p>
                                        <div className="order-totals">
                                            <span className="subtotal">Subtotal: ${totals.subtotal.toFixed(2)}</span>
                                            <span className="delivery">Delivery: ${(order.deliveryFee || 0).toFixed(2)}</span>
                                            <span className="total">Total: ${totals.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="order-actions">
                                        <button 
                                            className="btn btn-outline btn-sm"
                                            onClick={() => onViewOrder(order)}
                                            title={t('viewDetails')}
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button 
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => onEditOrder(order)}
                                            title={t('editOrderTooltip')}
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDeleteOrder(order.id)}
                                            title={t('deleteOrderTooltip')}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="order-details">
                                        <div className="items-grid">
                                            <div className="grid-header">
                                                <div>{t('employee')}</div>
                                                <div>{t('product')}</div>
                                                <div>{t('quantity')}</div>
                                                <div>{t('price')}</div>
                                                <div>{t('total')}</div>
                                            </div>
                                            
                                            {order.employees?.filter(emp => emp.employeeId).map(employee => (
                                                employee.products?.map((product, index) => (
                                                    <div key={`${employee.employeeId}_${index}`} className="grid-row">
                                                        <div>{employee.employeeId}</div>
                                                        <div>{product.name}</div>
                                                        <div>{product.quantity}</div>
                                                        <div>${product.pricePerItem?.toFixed(2)}</div>
                                                        <div>${(product.totalPrice || 0).toFixed(2)}</div>
                                                    </div>
                                                ))
                                            ))}
                                        </div>
                                        
                                        <div className="employee-breakdown">
                                            <h4>{t('employeeBreakdown')}</h4>
                                            {totals.uniqueEmployees.map(employeeName => {
                                                const employee = order.employees?.find(emp => emp.employeeId === employeeName);
                                                const foodTotal = employee?.products?.reduce((sum, product) => sum + (product.totalPrice || 0), 0) || 0;
                                                
                                                return (
                                                    <div key={employeeName} className="breakdown-item">
                                                        <span className="employee-name">{employeeName}:</span>
                                                        <span className="breakdown-details">
                                                            {t('food')}: ${foodTotal.toFixed(2)} + 
                                                            {t('delivery')}: ${totals.deliveryFeePerEmployee.toFixed(2)} = 
                                                            <strong>${(foodTotal + totals.deliveryFeePerEmployee).toFixed(2)}</strong>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderList;
