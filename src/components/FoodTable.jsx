import React, { useState } from 'react';
import { Edit3, Trash2, Save, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FoodTable = ({ 
    foodItems, 
    selectedItems, 
    onToggleSelection, 
    onRemoveItem, 
    onEditItem, 
    editingItem, 
    onSaveEdit, 
    onCancelEdit 
}) => {
    const { t } = useLanguage();
    const [editForm, setEditForm] = useState({});

    const handleEditClick = (item) => {
        setEditForm({
            foodItem: item.foodItem,
            quantity: item.quantity.toString(),
            pricePerItem: item.pricePerItem.toString()
        });
        onEditItem(item);
    };

    const handleSaveClick = (item) => {
        const updatedItem = {
            ...item,
            foodItem: editForm.foodItem,
            quantity: parseInt(editForm.quantity),
            pricePerItem: parseFloat(editForm.pricePerItem),
            totalPrice: parseInt(editForm.quantity) * parseFloat(editForm.pricePerItem)
        };
        
        onSaveEdit(updatedItem);
        setEditForm({});
    };

    const handleCancelClick = () => {
        setEditForm({});
        onCancelEdit();
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const isItemSelected = (itemId) => selectedItems.includes(itemId);
    const isEditing = (item) => editingItem && editingItem.id === item.id;

    return (
        <div className="card">
            <h2>Food Items</h2>
            <div className="table-container">
                <table className="food-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>
                                <div className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        className="item-checkbox"
                                        checked={selectedItems.length === foodItems.length && foodItems.length > 0}
                                        onChange={() => {}}
                                        style={{ cursor: 'not-allowed' }}
                                    />
                                </div>
                            </th>
                            <th>Employee Name</th>
                            <th>Food Item</th>
                            <th>Quantity</th>
                            <th>Price per Item</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            className="item-checkbox"
                                            checked={isItemSelected(item.id)}
                                            onChange={() => onToggleSelection(item.id)}
                                        />
                                    </div>
                                </td>
                                <td>{item.employeeName}</td>
                                <td>
                                    {isEditing(item) ? (
                                        <input
                                            type="text"
                                            value={editForm.foodItem}
                                            onChange={(e) => handleEditChange('foodItem', e.target.value)}
                                            className="form-control edit-mode"
                                        />
                                    ) : (
                                        item.foodItem
                                    )}
                                </td>
                                <td>
                                    {isEditing(item) ? (
                                        <input
                                            type="text"
                                            value={editForm.quantity}
                                            onChange={(e) => handleEditChange('quantity', e.target.value)}
                                            className="form-control edit-mode"
                                            style={{ width: '80px' }}
                                        />
                                    ) : (
                                        item.quantity
                                    )}
                                </td>
                                <td>
                                    {isEditing(item) ? (
                                        <input
                                            type="text"
                                            value={editForm.pricePerItem}
                                            onChange={(e) => handleEditChange('pricePerItem', e.target.value)}
                                            className="form-control edit-mode"
                                            style={{ width: '100px' }}
                                        />
                                    ) : (
                                        `$${item.pricePerItem.toFixed(2)}`
                                    )}
                                </td>
                                <td className="total-price">
                                    ${isEditing(item) 
                                        ? (parseInt(editForm.quantity) * parseFloat(editForm.pricePerItem) || 0).toFixed(2)
                                        : item.totalPrice.toFixed(2)
                                    }
                                </td>
                                <td>
                                    <div className="table-actions">
                                        {isEditing(item) ? (
                                            <>
                                                <button 
                                                    className="btn btn-save btn-sm"
                                                    onClick={() => handleSaveClick(item)}
                                                    title={t('save')}
                                                >
                                                    <Save size={14} />
                                                </button>
                                                <button 
                                                    className="btn btn-cancel btn-sm"
                                                    onClick={handleCancelClick}
                                                    title={t('cancel')}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    className="btn btn-edit btn-sm"
                                                    onClick={() => handleEditClick(item)}
                                                    title={t('edit')}
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-sm" 
                                                    onClick={() => onRemoveItem(item.id)}
                                                    title={t('remove')}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {foodItems.length === 0 && (
                    <div className="empty-message">
                        No food items added yet. Add your first item above!
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodTable;
