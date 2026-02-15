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
      <h2>{t('common.foodItems')}</h2>
      <div className="table-controls">
        <div className="controls-left">
          <span className="items-count">
            {t('common.totalItems')}: {foodItems.length}
          </span>
          <span className="selected-count">
            {t('table.selectedItems')}: {selectedItems.length}
          </span>
        </div>
        <div className="controls-right">
          <button className="btn btn-secondary btn-sm">
            {t('common.selectAll')}
          </button>
          <button className="btn btn-secondary btn-sm">
            {t('common.clearSelection')}
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="food-table">
          <thead>
            <tr>
              <th style={{ width: "50px" }}></th>
              <th>{t('common.employeeName')}</th>
              <th>{t('common.foodItem')}</th>
              <th>{t('common.quantity')}</th>
              <th>{t('common.price')}</th>
              <th>{t('common.total')}</th>
              <th>{t('orders.delivery')}</th>
              <th>{t('finalTotal')}</th>
              <th>{t('common.actions')}</th>
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
                        aria-label={t('table.selectRow')}
                      />
                    </div>
                  </td>
                  <td className="employee-name">
                    <div className="employee-info">
                      <div className="employee-avatar">
                        {row.employeeName.charAt(0).toUpperCase()}
                      </div>
                      <span>{row.employeeName}</span>
                    </div>
                  </td>
                  <td className="food-item-name">
                    <span>{row.foodItem}</span>
                  </td>
                  <td className="quantity">{row.quantity}</td>
                  <td className="price">${Number(row.pricePerItem || 0).toFixed(2)}</td>
                  <td className="total-price">${Number(foodTotal).toFixed(2)}</td>
                  <td className="delivery-fee">${Number(delivery).toFixed(2)}</td>
                  <td className="final-total">${Number(finalTotal).toFixed(2)}</td>
                  <td className="actions">
                    <button className="btn btn-icon btn-sm" title={t('orders.viewDetails')}>
                      👁
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {foodItems.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>{t('noData')}</h3>
          <p>{t('table.noFoodItemsMessage')}</p>
          <button className="btn btn-primary">
            {t('table.addFirstItem')}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodTable;
