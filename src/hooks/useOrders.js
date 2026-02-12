import { useState, useCallback } from 'react';

export const useOrders = () => {
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('foodOrders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    const saveOrders = useCallback((updatedOrders) => {
        setOrders(updatedOrders);
        localStorage.setItem('foodOrders', JSON.stringify(updatedOrders));
    }, []);

    const createOrder = useCallback((orderData) => {
        const updatedOrders = [...orders, orderData];
        saveOrders(updatedOrders);
        return orderData;
    }, [orders, saveOrders]);

    const updateOrder = useCallback((orderId, updatedData) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, ...updatedData } : order
        );
        saveOrders(updatedOrders);
        return updatedOrders.find(order => order.id === orderId);
    }, [orders, saveOrders]);

    const deleteOrder = useCallback((orderId) => {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        saveOrders(updatedOrders);
    }, [orders, saveOrders]);

    const clearAllOrders = useCallback(() => {
        saveOrders([]);
    }, [saveOrders]);

    const getOrderById = useCallback((orderId) => {
        return orders.find(order => order.id === orderId);
    }, [orders]);

    const getOrdersByEmployee = useCallback((employeeName) => {
        return orders.filter(order => 
            order.employees.some(emp => emp.employeeId === employeeName)
        );
    }, [orders]);

    const updateFoodItem = useCallback((itemId, updatedData) => {
        console.log('updateFoodItem called with:', { itemId, updatedData });
        // Parse the item ID to get order, employee, and product IDs
        const [orderId, employeeId, productId] = itemId.split('_');
        console.log('Parsed IDs in updateFoodItem:', { orderId, employeeId, productId });
        
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                const updatedEmployees = order.employees.map(employee => {
                    if (employee.employeeId === employeeId) {
                        const updatedProducts = employee.products.map(product => {
                            if (product.id === productId) {
                                console.log('Found product to update:', product);
                                const updatedProduct = {
                                    ...product,
                                    ...updatedData,
                                    totalPrice: updatedData.quantity * updatedData.pricePerItem
                                };
                                console.log('Updated product:', updatedProduct);
                                return updatedProduct;
                            }
                            return product;
                        });
                        
                        return {
                            ...employee,
                            products: updatedProducts
                        };
                    }
                    return employee;
                });
                
                return {
                    ...order,
                    employees: updatedEmployees
                };
            }
            return order;
        });
        
        console.log('Final updated orders:', updatedOrders);
        saveOrders(updatedOrders);
    }, [orders, saveOrders]);

    const deleteFoodItem = useCallback((itemId) => {
        console.log('deleteFoodItem called with:', itemId);
        // Parse the item ID to get order, employee, and product IDs
        const [orderId, employeeId, productId] = itemId.split('_');
        console.log('Parsed IDs in deleteFoodItem:', { orderId, employeeId, productId });
        
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                console.log('Found order to update:', order);
                const updatedEmployees = order.employees.map(employee => {
                    if (employee.employeeId === employeeId) {
                        console.log('Found employee to update:', employee);
                        const updatedProducts = employee.products.filter(
                            product => product.id !== productId
                        );
                        console.log('Products after filter:', updatedProducts);
                        
                        // If no products left for this employee, remove the employee
                        if (updatedProducts.length === 0) {
                            console.log('Removing employee as no products left');
                            return null;
                        }
                        
                        return {
                            ...employee,
                            products: updatedProducts
                        };
                    }
                    return employee;
                }).filter(Boolean); // Remove null employees
                
                console.log('Employees after update:', updatedEmployees);
                
                // If no employees left, remove the entire order
                if (updatedEmployees.length === 0) {
                    console.log('Removing entire order as no employees left');
                    return null;
                }
                
                return {
                    ...order,
                    employees: updatedEmployees
                };
            }
            return order;
        }).filter(Boolean); // Remove null orders
        
        console.log('Final orders after delete:', updatedOrders);
        saveOrders(updatedOrders);
    }, [orders, saveOrders]);

    const getAllFoodItems = useCallback(() => {
        const allItems = [];
        
        orders.forEach(order => {
            order.employees.forEach(employee => {
                employee.products.forEach(product => {
                    allItems.push({
                        id: `${order.id}_${employee.employeeId}_${product.id}`,
                        orderId: order.id,
                        orderName: order.name,
                        orderTimestamp: order.timestamp,
                        employeeName: employee.employeeId,
                        foodItem: product.name,
                        quantity: product.quantity,
                        pricePerItem: product.pricePerItem,
                        totalPrice: product.totalPrice,
                        deliveryFee: order.deliveryFee,
                        deliveryFeePerEmployee: employee.deliveryTax,
                        finalTotal: product.totalPrice + employee.deliveryTax
                    });
                });
            });
        });
        return allItems;
    }, [orders]);

    return {
        orders,
        createOrder,
        updateOrder,
        deleteOrder,
        clearAllOrders,
        getOrderById,
        getOrdersByEmployee,
        getAllFoodItems,
        updateFoodItem,
        deleteFoodItem
    };
};
