export const FoodItemShape = {
    id: 'number',
    employeeName: 'string',
    foodItem: 'string',
    quantity: 'number',
    pricePerItem: 'number',
    totalPrice: 'number'
};

export const ItemRowShape = {
    id: 'number',
    foodItem: 'string',
    quantity: 'string',
    pricePerItem: 'string'
};

export const EmployeeStatsShape = {
    items: 'array',
    totalAmount: 'number',
    totalQuantity: 'number',
    orderCount: 'number'
};
