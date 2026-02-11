export const exportToCSV = (foodItems) => {
    if (foodItems.length === 0) {
        throw new Error('No data available to export');
    }
    
    let csvContent = 'Employee Name,Food Item,Quantity,Price per Item,Total Price,Date\n';
    
    foodItems.forEach(item => {
        const date = new Date(item.id).toLocaleDateString();
        csvContent += `"${item.employeeName}","${item.foodItem}",${item.quantity},${item.pricePerItem},${item.totalPrice},"${date}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_food_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
};
