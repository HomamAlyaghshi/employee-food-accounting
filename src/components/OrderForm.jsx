import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, User, Package } from "lucide-react";
import { EMPLOYEES } from "../constants/employees";
import { useLanguage } from "../contexts/LanguageContext";

const OrderForm = ({ onCreateOrder, onReset, currentOrder }) => {
  const { t } = useLanguage();

  const [orderName, setOrderName] = useState(currentOrder?.name || "");
  const [deliveryFee, setDeliveryFee] = useState(currentOrder?.deliveryFee || 0);
  const [employees, setEmployees] = useState(currentOrder?.employees || []);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(-1);

  const currentEmployee =
    selectedEmployeeIndex >= 0 ? employees[selectedEmployeeIndex] : null;

  useEffect(() => {
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

  const addProduct = () => {
    if (!currentEmployee || !currentEmployee.employeeId) {
      alert("Please select an employee first");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: "",
      quantity: 1,
      pricePerItem: 0,
      totalPrice: 0,
    };

    setEmployees((prev) => {
      const updated = [...prev];
      const emp = updated[selectedEmployeeIndex];
      updated[selectedEmployeeIndex] = {
        ...emp,
        products: [...emp.products, newProduct],
      };
      return updated;
    });
  };

  const updateProduct = (employeeIndex, productIndex, field, value) => {
    setEmployees((prev) => {
      const updatedEmployees = [...prev];
      const employee = { ...updatedEmployees[employeeIndex] };
      const updatedProducts = [...employee.products];

      const updatedProduct = { ...updatedProducts[productIndex], [field]: value };

      if (field === "quantity" || field === "pricePerItem") {
        const quantity =
          field === "quantity"
            ? parseInt(value, 10) || 1
            : Number(updatedProduct.quantity) || 1;

        const pricePerItem =
          field === "pricePerItem"
            ? parseFloat(value) || 0
            : Number(updatedProduct.pricePerItem) || 0;

        updatedProduct.quantity = quantity;
        updatedProduct.pricePerItem = pricePerItem;
        updatedProduct.totalPrice = quantity * pricePerItem;
      }

      updatedProducts[productIndex] = updatedProduct;
      employee.products = updatedProducts;
      updatedEmployees[employeeIndex] = employee;
      return updatedEmployees;
    });
  };

  const removeProduct = (employeeIndex, productIndex) => {
    setEmployees((prev) => {
      const updatedEmployees = [...prev];
      const employee = { ...updatedEmployees[employeeIndex] };
      employee.products = employee.products.filter((_, i) => i !== productIndex);
      updatedEmployees[employeeIndex] = employee;
      return updatedEmployees;
    });
  };

  const removeEmployee = (index) => {
    if (employees.length <= 1) {
      alert("Order must have at least one employee");
      return;
    }

    setEmployees((prev) => prev.filter((_, i) => i !== index));

    if (selectedEmployeeIndex === index) {
      setSelectedEmployeeIndex(0);
    } else if (selectedEmployeeIndex > index) {
      setSelectedEmployeeIndex((i) => i - 1);
    }
  };

  const totals = useMemo(() => {
    let orderSubtotal = 0;
    const uniqueEmployees = new Set();

    employees.forEach((employee) => {
      if (employee.employeeId) {
        uniqueEmployees.add(employee.employeeId);
        const employeeSubtotal = (employee.products || []).reduce(
          (sum, product) => sum + (Number(product.totalPrice) || 0),
          0
        );
        orderSubtotal += employeeSubtotal;
      }
    });

    const deliveryTaxPerEmployee =
      uniqueEmployees.size > 0 ? deliveryFee / uniqueEmployees.size : 0;

    const totalDeliveryTax = deliveryTaxPerEmployee * uniqueEmployees.size;
    const finalOrderTotal = orderSubtotal + deliveryFee;

    return {
      orderSubtotal,
      deliveryTaxPerEmployee,
      totalDeliveryTax,
      finalOrderTotal,
      uniqueEmployees: Array.from(uniqueEmployees),
    };
  }, [employees, deliveryFee]);

  // Keep deliveryTax in employees synced (optional). If you don't need it stored, you can remove this.
  useEffect(() => {
    const per = totals.deliveryTaxPerEmployee;
    setEmployees((prev) =>
      prev.map((e) =>
        e.employeeId ? { ...e, deliveryTax: per } : { ...e, deliveryTax: 0 }
      )
    );
  }, [totals.deliveryTaxPerEmployee]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!orderName.trim()) {
      alert("Please enter an order name");
      return;
    }

    const validEmployees = employees.filter(
      (emp) => emp.employeeId && emp.products.length > 0
    );

    if (validEmployees.length === 0) {
      alert("Please add at least one employee with products");
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
    onReset?.();
  };

  return (
    <div className="card order-form">
      <h2>{currentOrder ? "Edit Order" : "Create New Order"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="order-header">
          <div className="form-group">
            <label htmlFor="orderName">Order Name</label>
            <input
              type="text"
              id="orderName"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              className="form-control"
              placeholder="e.g., Lunch Order - Restaurant Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deliveryFee">Delivery Fee</label>
            <input
              type="number"
              id="deliveryFee"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
              className="form-control"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <small className="form-help">
              This will be divided equally among {totals.uniqueEmployees.length} employee(s)
            </small>
          </div>
        </div>

        <div className="order-workflow">
          <div className="employees-section">
            <div className="section-header">
              <h3>Employees</h3>
              <button type="button" className="btn btn-primary btn-sm" onClick={addNewEmployee}>
                <Plus size={16} />
                Add Employee
              </button>
            </div>

            <div className="employees-list">
              {employees.map((employee, empIndex) => (
                <div
                  key={empIndex}
                  className={`employee-card ${selectedEmployeeIndex === empIndex ? "selected" : ""}`}
                  onClick={() => selectEmployee(empIndex)}
                >
                  <div className="employee-header">
                    <div className="employee-info">
                      <User size={16} />
                      <span className="employee-name">
                        {employee.employeeId || "Select Employee..."}
                      </span>
                    </div>

                    <div className="employee-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectEmployee(empIndex);
                        }}
                      >
                        Select
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEmployee(empIndex);
                        }}
                        disabled={employees.length <= 1}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {selectedEmployeeIndex === empIndex && (
                    <div className="employee-details">
                      <div className="employee-selector">
                        <select
                          value={employee.employeeId}
                          onChange={(e) => updateEmployee(empIndex, "employeeId", e.target.value)}
                          className="form-control"
                          required
                        >
                          <option value="">Select Employee...</option>
                          {EMPLOYEES.map((emp) => (
                            <option key={emp} value={emp}>
                              {emp}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="products-section">
                        <div className="products-header">
                          <h4>Products</h4>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={addProduct}
                            disabled={!employee.employeeId}
                          >
                            <Plus size={14} />
                            Add Product
                          </button>
                        </div>

                        <div className="products-list">
                          {employee.products.map((product, prodIndex) => (
                            <div key={product.id} className="product-item">
                              <div className="product-inputs">
                                <input
                                  type="text"
                                  value={product.name}
                                  onChange={(e) =>
                                    updateProduct(empIndex, prodIndex, "name", e.target.value)
                                  }
                                  className="form-control"
                                  placeholder="Product name"
                                  required
                                />

                                <input
                                  type="number"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    updateProduct(empIndex, prodIndex, "quantity", e.target.value)
                                  }
                                  className="form-control"
                                  min="1"
                                  placeholder="Qty"
                                  required
                                />

                                <input
                                  type="number"
                                  value={product.pricePerItem}
                                  onChange={(e) =>
                                    updateProduct(empIndex, prodIndex, "pricePerItem", e.target.value)
                                  }
                                  className="form-control"
                                  min="0"
                                  step="0.01"
                                  placeholder="Price"
                                  required
                                  style={{ textAlign: "left", direction: "ltr" }}
                                />

                                <div className="product-total">
                                  ${Number(product.totalPrice || 0).toFixed(2)}
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => removeProduct(empIndex, prodIndex)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {employee.products.length === 0 && (
                            <div className="empty-products">
                              <Package size={24} />
                              <p>No products added yet. Click "Add Product" to start.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {totals.uniqueEmployees.length > 0 && (
          <div className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-grid">
              <div className="summary-card">
                <h4>Subtotal (Food)</h4>
                <p>${totals.orderSubtotal.toFixed(2)}</p>
              </div>

              <div className="summary-card">
                <h4>Delivery Fee</h4>
                <p>${deliveryFee.toFixed(2)}</p>
              </div>

              <div className="summary-card">
                <h4>Delivery Fee Per Person</h4>
                <p>${totals.deliveryTaxPerEmployee.toFixed(2)}</p>
              </div>

              <div className="summary-card highlight">
                <h4>Total Order Amount</h4>
                <p>${totals.finalOrderTotal.toFixed(2)}</p>
              </div>
            </div>

            <div className="employee-breakdown">
              <h4>Employee Breakdown</h4>

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
                        Food: ${food.toFixed(2)} + Delivery: ${Number(employee.deliveryTax || 0).toFixed(2)} =
                        <strong> ${(food + Number(employee.deliveryTax || 0)).toFixed(2)}</strong>
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {currentOrder ? "Update Order" : "Create Order"}
          </button>

          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
