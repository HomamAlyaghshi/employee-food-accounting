// Employee Food Accounting System JavaScript - Multi-Item Version

// Employee database
const EMPLOYEES = [
    'همام اليغشي',
    'زياد المدور',
    'جودي الايوبي',
    'براء الناصيف',
    'عقبة جاموس',
    'حسام الاحمد',
    'بيان السد اللحام',
    'رزان الخن',
    'امينة اللحام',
    'سدرة اليغشي',
    'مها رباح',
    'عدنان الحوري'
];

// Global array to store all food items
let foodItems = [];
let itemCount = 1; // Track the number of item rows

// DOM elements
const foodForm = document.getElementById('foodForm');
const tableBody = document.getElementById('tableBody');
const emptyMessage = document.getElementById('emptyMessage');
const employeeTotals = document.getElementById('employeeTotals');
const grandTotalElement = document.getElementById('grandTotal');
const itemsContainer = document.getElementById('itemsContainer');
const statisticsSection = document.getElementById('statisticsSection');
const detailedStats = document.getElementById('detailedStats');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage if available
    loadFromLocalStorage();
    
    // Add form submit event listener
    foodForm.addEventListener('submit', handleFormSubmit);
    
    // Initial render
    updateDisplay();
    
    // Add input event listeners for validation
    setupInputValidation();
});

/**
 * Setup input validation for dynamic elements
 */
function setupInputValidation() {
    // Use event delegation for dynamically created inputs
    document.addEventListener('input', function(event) {
        if (event.target.classList.contains('price-input')) {
            validatePriceInput(event.target);
        } else if (event.target.classList.contains('quantity-input')) {
            validateQuantityInput(event.target);
        }
    });
}

/**
 * Validate price input
 * @param {HTMLInputElement} input - Price input element
 */
function validatePriceInput(input) {
    let value = input.value;
    
    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const decimalPoints = value.match(/\./g);
    if (decimalPoints && decimalPoints.length > 1) {
        value = value.replace(/\.+$/, '');
    }
    
    // Limit to 2 decimal places
    const parts = value.split('.');
    if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
        value = parts.join('.');
    }
    
    input.value = value;
}

/**
 * Validate quantity input
 * @param {HTMLInputElement} input - Quantity input element
 */
function validateQuantityInput(input) {
    let value = input.value;
    
    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, '');
    
    // Ensure minimum value of 1
    if (value && parseInt(value) < 1) {
        value = '1';
    }
    
    input.value = value;
}

/**
 * Add a new item row to the form
 */
function addItemRow() {
    itemCount++;
    
    const itemRow = document.createElement('div');
    itemRow.className = 'item-row';
    itemRow.setAttribute('data-item-id', itemCount);
    
    itemRow.innerHTML = `
        <div class="form-group">
            <label for="foodItem_${itemCount}">Food Item Name</label>
            <input type="text" id="foodItem_${itemCount}" name="foodItem" class="food-item-input" required>
        </div>
        <div class="form-group">
            <label for="quantity_${itemCount}">Quantity</label>
            <input type="number" id="quantity_${itemCount}" name="quantity" class="quantity-input" min="1" required>
        </div>
        <div class="form-group">
            <label for="pricePerItem_${itemCount}">Price per Item ($)</label>
            <input type="number" id="pricePerItem_${itemCount}" name="pricePerItem" class="price-input" min="0" step="0.01" required>
        </div>
        <div class="form-group">
            <label>&nbsp;</label>
            <button type="button" class="btn btn-remove" onclick="removeItemRow(${itemCount})">Remove</button>
        </div>
    `;
    
    itemsContainer.appendChild(itemRow);
    
    // Add animation
    itemRow.style.animation = 'slideIn 0.3s ease';
    
    // Update remove buttons visibility
    updateRemoveButtons();
}

/**
 * Remove an item row from the form
 * @param {number} itemId - ID of the item row to remove
 */
function removeItemRow(itemId) {
    const itemRow = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemRow) {
        itemRow.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            itemRow.remove();
            updateRemoveButtons();
        }, 300);
    }
}

/**
 * Update visibility of remove buttons based on number of rows
 */
function updateRemoveButtons() {
    const itemRows = document.querySelectorAll('.item-row');
    const removeButtons = document.querySelectorAll('.btn-remove');
    
    // Show remove buttons only if there's more than 1 row
    removeButtons.forEach(button => {
        button.style.display = itemRows.length > 1 ? 'block' : 'none';
    });
}

/**
 * Reset the entire form
 */
function resetForm() {
    foodForm.reset();
    
    // Remove all item rows except the first one
    const itemRows = document.querySelectorAll('.item-row');
    itemRows.forEach((row, index) => {
        if (index > 0) {
            row.remove();
        }
    });
    
    // Reset item count
    itemCount = 1;
    
    // Update remove buttons
    updateRemoveButtons();
    
    // Focus on employee name
    document.getElementById('employeeName').focus();
}

/**
 * Show detailed employee statistics
 */
function showEmployeeStats() {
    statisticsSection.style.display = 'block';
    updateDetailedStats();
    
    // Scroll to statistics section
    statisticsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide detailed employee statistics
 */
function hideEmployeeStats() {
    statisticsSection.style.display = 'none';
}

/**
 * Update detailed statistics display
 */
function updateDetailedStats() {
    detailedStats.innerHTML = '';
    
    if (foodItems.length === 0) {
        detailedStats.innerHTML = '<p style="text-align: center; color: #999;">No data available for statistics</p>';
        return;
    }
    
    // Group items by employee
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
    
    // Create stat cards for each employee
    Object.entries(employeeData).forEach(([employeeName, data]) => {
        const statCard = createEmployeeStatCard(employeeName, data);
        detailedStats.appendChild(statCard);
    });
}

/**
 * Create employee statistics card
 * @param {string} employeeName - Employee name
 * @param {Object} data - Employee data
 * @returns {HTMLDivElement} - Statistics card element
 */
function createEmployeeStatCard(employeeName, data) {
    const card = document.createElement('div');
    card.className = 'employee-stat-card';
    
    const averageOrderValue = data.orderCount > 0 ? data.totalAmount / data.orderCount : 0;
    const averageItemPrice = data.totalQuantity > 0 ? data.totalAmount / data.totalQuantity : 0;
    
    card.innerHTML = `
        <h3>${escapeHtml(employeeName)}</h3>
        <div class="stat-row">
            <div class="stat-item">
                <div class="stat-label">Total Amount</div>
                <div class="stat-value">$${data.totalAmount.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Items</div>
                <div class="stat-value">${data.totalQuantity}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Order Count</div>
                <div class="stat-value">${data.orderCount}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Avg Order Value</div>
                <div class="stat-value">$${averageOrderValue.toFixed(2)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Avg Item Price</div>
                <div class="stat-value">$${averageItemPrice.toFixed(2)}</div>
            </div>
        </div>
        <div class="item-list">
            <h4>Order History:</h4>
            ${data.items.map(item => `
                <div class="item-entry">
                    <span class="item-name">${escapeHtml(item.foodItem)}</span>
                    <div class="item-details">
                        <span>Qty: ${item.quantity}</span>
                        <span class="item-price">$${item.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

/**
 * Export employee data to CSV
 */
function exportEmployeeData() {
    if (foodItems.length === 0) {
        showError('No data available to export');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Employee Name,Food Item,Quantity,Price per Item,Total Price,Date\n';
    
    foodItems.forEach(item => {
        const date = new Date(item.id).toLocaleDateString();
        csvContent += `"${item.employeeName}","${item.foodItem}",${item.quantity},${item.pricePerItem},${item.totalPrice},"${date}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_food_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get employee name
    const employeeName = document.getElementById('employeeName').value.trim();
    
    // Validate employee name
    if (!employeeName) {
        showError('Please enter an employee name');
        return;
    }
    
    // Get all item rows
    const itemRows = document.querySelectorAll('.item-row');
    const newItems = [];
    let hasError = false;
    
    // Validate each item row
    itemRows.forEach((row, index) => {
        const itemId = row.getAttribute('data-item-id');
        const foodItem = document.getElementById(`foodItem_${itemId}`).value.trim();
        const quantity = parseInt(document.getElementById(`quantity_${itemId}`).value);
        const pricePerItem = parseFloat(document.getElementById(`pricePerItem_${itemId}`).value);
        
        // Skip if this row is empty (except first row)
        if (index > 0 && !foodItem && !quantity && !pricePerItem) {
            return;
        }
        
        // Validate inputs
        if (!foodItem) {
            showError(`Please enter a food item name for item ${index + 1}`);
            hasError = true;
            return;
        }
        
        if (isNaN(quantity) || quantity < 1) {
            showError(`Quantity must be at least 1 for item ${index + 1}`);
            hasError = true;
            return;
        }
        
        if (isNaN(pricePerItem) || pricePerItem < 0) {
            showError(`Price per item must be a positive number for item ${index + 1}`);
            hasError = true;
            return;
        }
        
        // Calculate total price
        const totalPrice = quantity * pricePerItem;
        
        // Create food item object
        const newFoodItem = {
            id: Date.now() + index, // Unique ID using timestamp + index
            employeeName,
            foodItem,
            quantity,
            pricePerItem,
            totalPrice
        };
        
        newItems.push(newFoodItem);
    });
    
    // If there are validation errors, stop processing
    if (hasError) {
        return;
    }
    
    // Check if at least one item was added
    if (newItems.length === 0) {
        showError('Please add at least one food item');
        return;
    }
    
    // Add all new items to the array
    foodItems.push(...newItems);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update display
    updateDisplay();
    
    // Reset form
    resetForm();
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background-color: #e74c3c;
        color: white;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
        text-align: center;
        animation: slideIn 0.3s ease;
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    // Add to body
    document.body.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 3000);
}

/**
 * Remove a food item from the list
 * @param {number} itemId - ID of the item to remove
 */
function removeItem(itemId) {
    // Remove item from array
    foodItems = foodItems.filter(item => item.id !== itemId);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update display
    updateDisplay();
}

/**
 * Update the entire display (table and totals)
 */
function updateDisplay() {
    updateTable();
    updateTotals();
}

/**
 * Update the food items table
 */
function updateTable() {
    // Clear existing table content
    tableBody.innerHTML = '';
    
    // Check if there are items to display
    if (foodItems.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }
    
    // Hide empty message
    emptyMessage.style.display = 'none';
    
    // Add each food item to the table
    foodItems.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
}

/**
 * Create a table row for a food item
 * @param {Object} item - Food item object
 * @returns {HTMLTableRowElement} - Table row element
 */
function createTableRow(item) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${escapeHtml(item.employeeName)}</td>
        <td>${escapeHtml(item.foodItem)}</td>
        <td>${item.quantity}</td>
        <td>$${item.pricePerItem.toFixed(2)}</td>
        <td class="total-price">$${item.totalPrice.toFixed(2)}</td>
        <td>
            <button class="btn btn-danger" onclick="removeItem(${item.id})">
                Remove
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Update employee totals and grand total
 */
function updateTotals() {
    // Calculate totals per employee
    const employeeTotalsMap = {};
    let grandTotal = 0;
    
    foodItems.forEach(item => {
        // Add to employee total
        if (!employeeTotalsMap[item.employeeName]) {
            employeeTotalsMap[item.employeeName] = 0;
        }
        employeeTotalsMap[item.employeeName] += item.totalPrice;
        
        // Add to grand total
        grandTotal += item.totalPrice;
    });
    
    // Update employee totals display
    updateEmployeeTotalsDisplay(employeeTotalsMap);
    
    // Update grand total display
    grandTotalElement.textContent = grandTotal.toFixed(2);
}

/**
 * Update the employee totals display
 * @param {Object} employeeTotalsMap - Map of employee names to their totals
 */
function updateEmployeeTotalsDisplay(employeeTotalsMap) {
    // Clear existing content
    employeeTotals.innerHTML = '';
    
    // Check if there are any totals to display
    if (Object.keys(employeeTotalsMap).length === 0) {
        employeeTotals.innerHTML = '<p style="text-align: center; color: #999;">No employee totals to display</p>';
        return;
    }
    
    // Create a card for each employee
    Object.entries(employeeTotalsMap).forEach(([employeeName, total]) => {
        const card = createEmployeeTotalCard(employeeName, total);
        employeeTotals.appendChild(card);
    });
}

/**
 * Create a card displaying an employee's total
 * @param {string} employeeName - Employee name
 * @param {number} total - Total amount
 * @returns {HTMLDivElement} - Employee total card element
 */
function createEmployeeTotalCard(employeeName, total) {
    const card = document.createElement('div');
    card.className = 'employee-total-card';
    
    card.innerHTML = `
        <div class="employee-name">${escapeHtml(employeeName)}</div>
        <div class="employee-total">$${total.toFixed(2)}</div>
    `;
    
    return card;
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Save data to localStorage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('foodItems', JSON.stringify(foodItems));
    } catch (error) {
        console.warn('Could not save to localStorage:', error);
    }
}

/**
 * Load data from localStorage
 */
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('foodItems');
        if (saved) {
            foodItems = JSON.parse(saved);
        }
    } catch (error) {
        console.warn('Could not load from localStorage:', error);
        foodItems = [];
    }
}

/**
 * Clear all data (for potential future use)
 */
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        foodItems = [];
        saveToLocalStorage();
        updateDisplay();
    }
}

// Add keyboard shortcuts for better UX
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.form === foodForm) {
            event.preventDefault();
            foodForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Ctrl/Cmd + N to add new item row
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        addItemRow();
    }
});

// Add CSS animation for slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);
