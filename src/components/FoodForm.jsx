import React from 'react';
import { EMPLOYEES } from '../constants/employees';
import ItemRow from './ItemRow';

const FoodForm = ({
    selectedEmployee,
    onEmployeeChange,
    itemRows,
    onUpdateItem,
    onUpdatePrice,
    onUpdateQuantity,
    onAddItemRow,
    onRemoveItemRow,
    onSubmit,
    onReset,
    showRemoveButtons
}) => {
    return (
        <div className="card form-section">
            <h2>Add Food Items</h2>
            <form onSubmit={onSubmit}>
                <div className="employee-section">
                    <div className="form-group">
                        <label htmlFor="employeeName">Employee Name</label>
                        <select
                            id="employeeName"
                            value={selectedEmployee}
                            onChange={(e) => onEmployeeChange(e.target.value)}
                            className="form-control"
                            required
                        >
                            <option value="">Select Employee...</option>
                            {EMPLOYEES.map(employee => (
                                <option key={employee} value={employee}>{employee}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="items-section">
                    <h3>Food Items</h3>
                    <div className="items-container">
                        {itemRows.map((row, index) => (
                            <ItemRow
                                key={row.id}
                                row={row}
                                index={index}
                                onUpdateItem={onUpdateItem}
                                onUpdatePrice={onUpdatePrice}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={onRemoveItemRow}
                                showRemoveButton={showRemoveButtons}
                            />
                        ))}
                    </div>
                    
                    <div className="item-actions">
                        <button type="button" className="btn btn-outline" onClick={onAddItemRow}>
                            + Add Another Item
                        </button>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Add All Items</button>
                    <button type="button" className="btn btn-ghost" onClick={onReset}>Clear Form</button>
                </div>
            </form>
        </div>
    );
};

export default FoodForm;
