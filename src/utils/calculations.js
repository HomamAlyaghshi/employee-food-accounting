export const calculateTotals = (foodItems) => {
    const employeeTotalsMap = {};
    let grandTotal = 0;
    
    foodItems.forEach(item => {
        if (!employeeTotalsMap[item.employeeName]) {
            employeeTotalsMap[item.employeeName] = 0;
        }
        employeeTotalsMap[item.employeeName] += item.totalPrice;
        grandTotal += item.totalPrice;
    });
    
    return { employeeTotalsMap, grandTotal };
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
