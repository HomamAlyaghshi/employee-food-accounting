import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, User, Package, X } from "lucide-react";
import { EMPLOYEES } from "../constants/employees";
import { useLanguage } from "../contexts/LanguageContext";

const OrderForm = ({ onCreateOrder, onReset, currentOrder, isViewMode = false }) => {
  const { t } = useLanguage();

  const [orderName, setOrderName] = useState(currentOrder?.name || "");
  const [deliveryFee, setDeliveryFee] = useState(currentOrder?.deliveryFee || 0);
  const [employees, setEmployees] = useState(currentOrder?.employees || []);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(-1);
  const [customEmployees, setCustomEmployees] = useState([]);

  const currentEmployee =
    selectedEmployeeIndex >= 0 ? employees[selectedEmployeeIndex] : null;

  useEffect(() => {
    // Load custom employees from localStorage
    const savedEmployees = localStorage.getItem('customEmployees');
    if (savedEmployees) {
      const employeesData = JSON.parse(savedEmployees);
      setCustomEmployees(employeesData.map(emp => emp.name));
    }
    
    if (employees.length === 0 && !currentOrder) {
      setEmployees([
        {
          employeeId: "",
          products: [],
          deliveryTax: 0,
        },
      ]);
      setSelectedEmployeeIndex(0);
    } else if (employees.length > 0 && selectedEmployeeIndex === -1) {
      setSelectedEmployeeIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNewEmployee = () => {
    const newEmployee = { employeeId: "", products: [], deliveryTax: 0 };
    setEmployees((prev) => [...prev, newEmployee]);
    setSelectedEmployeeIndex(employees.length);
  };

  const getAllEmployees = () => {
    return [...customEmployees];
  };

  const selectEmployee = (index) => {
    setSelectedEmployeeIndex(index);
  };

  const updateEmployee = (index, field, value) => {
    setEmployees((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeEmployee = (index) => {
    setEmployees((prev) => prev.filter((_, i) => i !== index));
    if (selectedEmployeeIndex >= employees.length - 1) {
      setSelectedEmployeeIndex(Math.max(0, employees.length - 2));
    }
  };

  const addProduct = (employeeIndex) => {
    const newProduct = {
      id: Date.now(),
      name: "",
      quantity: 1,
      pricePerItem: 0,
      totalPrice: 0,
    };

    setEmployees((prev) => {
      const updated = [...prev];
      updated[employeeIndex] = {
        ...updated[employeeIndex],
        products: [...updated[employeeIndex].products, newProduct],
      };
      return updated;
    });
  };

  const updateProduct = (employeeIndex, productIndex, field, value) => {
    setEmployees((prev) => {
      const updated = [...prev];
      const products = [...updated[employeeIndex].products];
      products[productIndex] = { ...products[productIndex], [field]: value };

      if (field === "quantity" || field === "pricePerItem") {
        const quantity = parseInt(products[productIndex].quantity) || 0;
        const pricePerItem = parseFloat(products[productIndex].pricePerItem) || 0;
        products[productIndex].totalPrice = quantity * pricePerItem;
      }

      updated[employeeIndex] = { ...updated[employeeIndex], products };
      return updated;
    });
  };

  const removeProduct = (employeeIndex, productIndex) => {
    setEmployees((prev) => {
      const updated = [...prev];
      updated[employeeIndex] = {
        ...updated[employeeIndex],
        products: updated[employeeIndex].products.filter((_, i) => i !== productIndex),
      };
      return updated;
    });
  };

  const totals = useMemo(() => {
    const orderSubtotal = employees.reduce((sum, employee) => {
      return (
        sum +
        employee.products.reduce((empSum, product) => {
          return empSum + (Number(product.totalPrice) || 0);
        }, 0)
      );
    }, 0);

    const uniqueEmployees = employees.filter((emp) => emp.employeeId);
    const deliveryTaxPerEmployee =
      uniqueEmployees.length > 0 ? deliveryFee / uniqueEmployees.length : 0;

    const finalOrderTotal = orderSubtotal + deliveryFee;

    return {
      orderSubtotal,
      uniqueEmployees,
      deliveryTaxPerEmployee,
      finalOrderTotal,
    };
  }, [employees, deliveryFee]);

  useEffect(() => {
    const updatedEmployees = employees.map((employee) => ({
      ...employee,
      deliveryTax: totals.deliveryTaxPerEmployee,
    }));
    setEmployees(updatedEmployees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.deliveryTaxPerEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validEmployees = employees.filter(
      (emp) => emp.employeeId && emp.products.length > 0
    );

    if (validEmployees.length === 0) {
      alert(t('pleaseAddEmployeeWithProducts'));
      return;
    }

    const orderData = {
      id: currentOrder?.id || Date.now(),
      name: orderName.trim(),
      deliveryFee,
      employees: validEmployees,
      timestamp: currentOrder?.timestamp || Date.now(),
    };

    onCreateOrder(orderData);
  };

  const handleReset = () => {
    setOrderName("");
    setDeliveryFee(0);
    setEmployees([{ employeeId: "", products: [], deliveryTax: 0 }]);
    setSelectedEmployeeIndex(0);
  };

  return (
    <div className="card">
      <div className={`form-header ${isViewMode ? 'view-mode' : (currentOrder ? 'edit-mode' : 'create-mode')}`}>
        <h2>{isViewMode ? t('orderDetails') : (currentOrder ? t('editOrder') : t('createNewOrder'))}</h2>
        {isViewMode && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
            <X size={16} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="orderName">{t('orderName')}</label>
          <input
            type="text"
            id="orderName"
            value={orderName}
            onChange={(e) => setOrderName(e.target.value)}
            className="form-control"
            placeholder={t('orderNamePlaceholder')}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliveryFee">{t('deliveryFee')}</label>
          <input
            type="number"
            id="deliveryFee"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
            className="form-control"
            min="0"
            step="0.01"
            disabled={isViewMode}
          />
        </div>

        <div className="employees-section">
          <div className="section-header">
            <h3>{t('products')}</h3>
            {!isViewMode && (
              <button type="button" className="btn btn-secondary btn-sm" onClick={addNewEmployee}>
                <Plus size={14} />
                {t('addEmployeeToOrder')}
              </button>
            )}
          </div>

          {employees.map((employee, empIndex) => (
            <div key={empIndex} className="employee-card">
              <div className="employee-header">
                <div className="employee-select">
                  <User size={16} />
                  <select
                    value={employee.employeeId}
                    onChange={(e) => updateEmployee(empIndex, "employeeId", e.target.value)}
                    className="form-control"
                    disabled={isViewMode}
                    required
                  >
                    <option value="">{t('selectEmployee')}</option>
                    {getAllEmployees().map((emp) => (
                      <option key={emp} value={emp}>
                        {emp}
                      </option>
                    ))}
                  </select>
                </div>
                {!isViewMode && employees.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removeEmployee(empIndex)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="products-section">
                <div className="products-header">
                  <h4>{t('products')}</h4>
                  {!isViewMode && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => addProduct(empIndex)}
                    >
                      <Plus size={12} />
                      {t('addProduct')}
                    </button>
                  )}
                </div>

                {employee.products.map((product, prodIndex) => (
                  <div key={prodIndex} className="product-row">
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(empIndex, prodIndex, "name", e.target.value)
                      }
                      className="form-control"
                      placeholder={t('productName')}
                      disabled={isViewMode}
                      required
                    />
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        updateProduct(empIndex, prodIndex, "quantity", e.target.value)
                      }
                      className="form-control"
                      placeholder={t('qty')}
                      min="1"
                      disabled={isViewMode}
                      required
                    />
                    <input
                      type="number"
                      value={product.pricePerItem}
                      onChange={(e) =>
                        updateProduct(empIndex, prodIndex, "pricePerItem", e.target.value)
                      }
                      className="form-control"
                      placeholder={t('price')}
                      min="0"
                      step="0.01"
                      disabled={isViewMode}
                      required
                    />
                    <div className="product-total">
                      ${(product.totalPrice || 0).toFixed(2)}
                    </div>
                    {!isViewMode && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeProduct(empIndex, prodIndex)}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {totals.uniqueEmployees.length > 0 && (
          <div className="order-summary">
            <h3>{t('orderSummary')}</h3>

            <div className="summary-grid">
              <div className="summary-card">
                <h4>{t('subtotal')}</h4>
                <p>${totals.orderSubtotal.toFixed(2)}</p>
              </div>

              <div className="summary-card">
                <h4>{t('deliveryFee')}</h4>
                <p>${deliveryFee.toFixed(2)}</p>
              </div>

              <div className="summary-card">
                <h4>{t('deliveryFeePerPerson')}</h4>
                <p>${totals.deliveryTaxPerEmployee.toFixed(2)}</p>
              </div>

              <div className="summary-card highlight">
                <h4>{t('totalOrderAmount')}</h4>
                <p>${totals.finalOrderTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="employee-breakdown">
              <h4>{t('employeeBreakdown')}</h4>

              {employees
                .filter((emp) => emp.employeeId)
                .map((employee) => {
                  const food = employee.products.reduce(
                    (sum, p) => sum + (Number(p.totalPrice) || 0),
                    0
                  );
                  return (
                    <div key={employee.employeeId} className="breakdown-item">
                      <span className="employee-name">{employee.employeeId}:</span>
                      <span className="breakdown-details">
                        {t('food')}: ${food.toFixed(2)} + {t('delivery')}: ${Number(employee.deliveryTax || 0).toFixed(2)} =
                        <strong> ${(food + Number(employee.deliveryTax || 0)).toFixed(2)}</strong>
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {!isViewMode && (
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {currentOrder ? t('updateOrder') : t('createOrder')}
            </button>

            <button type="button" className="btn btn-ghost" onClick={handleReset}>
              {t('clearForm')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderForm;
