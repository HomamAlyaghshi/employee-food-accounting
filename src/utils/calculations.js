export const calculateTotals = (foodItems) => {
    const employeeTotalsMap = {};
    const employeeDeliveryFees = {};
    let grandTotal = 0;
    
    // Group items by order to calculate delivery fee per employee correctly
    const orderGroups = {};
    foodItems.forEach(item => {
        const orderKey = item.orderId || item.orderName || 'default';
        if (!orderGroups[orderKey]) {
            orderGroups[orderKey] = {
                employees: new Set(),
                deliveryFee: item.deliveryFee || 0,
                items: []
            };
        }
        orderGroups[orderKey].employees.add(item.employeeName);
        orderGroups[orderKey].items.push(item);
    });
    
    // Calculate delivery fee per employee for each order
    Object.keys(orderGroups).forEach(orderKey => {
        const order = orderGroups[orderKey];
        const deliveryFeePerEmployee = order.employees.size > 0 ? order.deliveryFee / order.employees.size : 0;
        
        order.items.forEach(item => {
            if (!employeeTotalsMap[item.employeeName]) {
                employeeTotalsMap[item.employeeName] = 0;
                employeeDeliveryFees[item.employeeName] = 0;
            }
            employeeTotalsMap[item.employeeName] += item.totalPrice;
            employeeDeliveryFees[item.employeeName] += deliveryFeePerEmployee;
            grandTotal += item.totalPrice;
        });
    });
    
    // Add delivery fees to totals (only once per employee per order)
    Object.keys(employeeDeliveryFees).forEach(employee => {
        employeeTotalsMap[employee] += employeeDeliveryFees[employee];
        grandTotal += employeeDeliveryFees[employee];
    });
    
    return { 
        employeeTotalsMap, 
        grandTotal,
        employeeDeliveryFees
    };
};

export const getEmployeeStats = (foodItems) => {
    const employeeData = {};
    
    foodItems.forEach(item => {
        if (!employeeData[item.employeeName]) {
            employeeData[item.employeeName] = {
                items: [],
                totalAmount: 0,
                totalQuantity: 0,
                orderCount: 0
            };
        }
        
        employeeData[item.employeeName].items.push(item);
        employeeData[item.employeeName].totalAmount += item.totalPrice;
        employeeData[item.employeeName].totalQuantity += item.quantity;
        employeeData[item.employeeName].orderCount++;
    });
    
    return employeeData;
};

export const calculateItemTotal = (quantity, pricePerItem) => {
    const qty = parseInt(quantity) || 0;
    const price = parseFloat(pricePerItem) || 0;
    return qty * price;
};

export const calculateDeliveryFeePerEmployee = (deliveryFee, numberOfEmployees) => {
    if (numberOfEmployees <= 0) return 0;
    return deliveryFee / numberOfEmployees;
};

export const generateOrderId = () => {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
