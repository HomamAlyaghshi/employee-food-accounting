import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const FoodTable = ({
  foodItems,
  selectedItems,
  onToggleSelection,
}) => {
  const { t } = useLanguage();

  const isItemSelected = (id) => selectedItems.includes(id);

  return (
    <div className="card">
      <h2>Food Items</h2>
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
            </tr>
          </thead>

          <tbody>
            {foodItems.map((row) => {
              const foodTotal = Number(row.totalPrice || 0);
              const delivery = row.deliveryFeePerEmployee || 0;
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
                  <td>{row.foodItem}</td>
                  <td>{row.quantity}</td>
                  <td>${Number(row.pricePerItem || 0).toFixed(2)}</td>
                  <td className="total-price">${Number(foodTotal).toFixed(2)}</td>
                  <td className="delivery-fee">${Number(delivery).toFixed(2)}</td>
                  <td className="final-total">${Number(finalTotal).toFixed(2)}</td>
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
