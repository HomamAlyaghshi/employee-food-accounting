import React from 'react';

const ItemRow = ({ 
    row, 
    index, 
    onUpdateItem, 
    onUpdatePrice, 
    onUpdateQuantity, 
    onRemove, 
    showRemoveButton 
}) => {
    return (
        <div className="item-row" data-item-id={row.id}>
            <div className="form-group">
                <label htmlFor={`foodItem_${row.id}`}>Food Item Name</label>
                <input
                    type="text"
                    id={`foodItem_${row.id}`}
                    value={row.foodItem}
                    onChange={(e) => onUpdateItem(row.id, 'foodItem', e.target.value)}
                    className="form-control"
                    required={index === 0}
                />
            </div>
            <div className="form-group">
                <label htmlFor={`quantity_${row.id}`}>Quantity</label>
                <input
                    type="text"
                    id={`quantity_${row.id}`}
                    value={row.quantity}
                    onChange={(e) => onUpdateQuantity(row.id, e.target.value)}
                    className="form-control"
                    required={index === 0}
                />
            </div>
            <div className="form-group">
                <label htmlFor={`pricePerItem_${row.id}`}>Price per Item ($)</label>
                <input
                    type="text"
                    id={`pricePerItem_${row.id}`}
                    value={row.pricePerItem}
                    onChange={(e) => onUpdatePrice(row.id, e.target.value)}
                    className="form-control"
                    required={index === 0}
                />
            </div>
            <div className="form-group">
                <label>&nbsp;</label>
                <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onRemove(row.id)}
                    style={{ display: showRemoveButton ? 'block' : 'none' }}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default ItemRow;
