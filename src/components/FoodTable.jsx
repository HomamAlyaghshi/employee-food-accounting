import React, { useState } from "react";
import { Edit3, Trash2, Save, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const FoodTable = ({
  foodItems,
  selectedItems,
  onToggleSelection,
  onRemoveItem,
  onEditItem,
  editingItem,
  onSaveEdit,
  onCancelEdit,
}) => {
  const { t } = useLanguage();
  const [editForm, setEditForm] = useState({ foodItem: "", quantity: "1", pricePerItem: "0" });

  const isItemSelected = (id) => selectedItems.includes(id);
  const isEditing = (row) => editingItem && editingItem.id === row.id;

  const handleEditClick = (row) => {
    setEditForm({
      foodItem: row.foodItem ?? "",
      quantity: String(row.quantity ?? 1),
      pricePerItem: String(row.pricePerItem ?? 0),
    });
    onEditItem(row);
  };

  const handleSaveClick = (row) => {
    console.log('handleSaveClick called with row:', row);
    const quantity = parseInt(editForm.quantity, 10) || 1;
    const pricePerItem = parseFloat(editForm.pricePerItem) || 0;

    const updatedRow = {
      ...row,
      foodItem: editForm.foodItem,
      quantity,
      pricePerItem,
      totalPrice: quantity * pricePerItem,
    };

    console.log('Calling onSaveEdit with:', updatedRow);
    onSaveEdit(updatedRow);
    setEditForm({ foodItem: "", quantity: "1", pricePerItem: "0" });
  };

  const handleCancelClick = () => {
    setEditForm({ foodItem: "", quantity: "1", pricePerItem: "0" });
    onCancelEdit();
  };

  return (
    <div className="card">
      <h2>Food Items</h2>
      
      <button 
        onClick={() => console.log('Current foodItems:', foodItems)}
        style={{marginBottom: '10px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
      >
        Debug: Log Food Items
      </button>

      <div className="table-container">
        <table className="food-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}></th>
              <th>Employee Name</th>
              <th>Food Item</th>
              <th>Quantity</th>
              <th>Price per Item</th>
              <th>Total Price</th>
              <th>Delivery Fee</th>
              <th>Final Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {foodItems.map((row) => {
              const editing = isEditing(row);

              const qty = parseInt(editForm.quantity, 10) || 1;
              const price = parseFloat(editForm.pricePerItem) || 0;

              const editedFoodTotal = qty * price || 0;
              const delivery = row.deliveryFeePerEmployee || 0;

              const foodTotal = editing ? editedFoodTotal : Number(row.totalPrice || 0);
              const finalTotal = foodTotal + delivery;

              return (
                <tr key={row.id}>
                  <td>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        className="item-checkbox"
                        checked={isItemSelected(row.id)}
                        onChange={() => onToggleSelection(row.id)}
                        aria-label="Select row"
                      />
                    </div>
                  </td>

                  <td>{row.employeeName}</td>

                  <td>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.foodItem}
                        onChange={(e) => setEditForm({ ...editForm, foodItem: e.target.value })}
                        className="form-control edit-mode"
                      />
                    ) : (
                      row.foodItem
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                        className="form-control edit-mode"
                        style={{ width: "80px" }}
                        min="1"
                      />
                    ) : (
                      row.quantity
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        type="number"
                        value={editForm.pricePerItem}
                        onChange={(e) => setEditForm({ ...editForm, pricePerItem: e.target.value })}
                        className="form-control edit-mode"
                        style={{ width: "100px", textAlign: "left", direction: "ltr" }}
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      `$${Number(row.pricePerItem || 0).toFixed(2)}`
                    )}
                  </td>

                  <td className="total-price">${Number(foodTotal).toFixed(2)}</td>

                  <td className="delivery-fee">${Number(delivery).toFixed(2)}</td>

                  <td className="final-total">${Number(finalTotal).toFixed(2)}</td>

                  <td>
                    <div className="table-actions">
                      {editing ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-save btn-sm"
                            onClick={() => handleSaveClick(row)}
                            title={t("save")}
                          >
                            <Save size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-cancel btn-sm"
                            onClick={handleCancelClick}
                            title={t("cancel")}
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-edit btn-sm"
                            onClick={() => handleEditClick(row)}
                            title={t("edit")}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onRemoveItem(row.id)}
                            title={t("remove")}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {foodItems.length === 0 && (
          <div className="empty-message">No food items added yet. Add your first item!</div>
        )}
      </div>
    </div>
  );
};

export default FoodTable;
