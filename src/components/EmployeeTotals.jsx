import React from 'react';

const EmployeeTotals = ({ employeeTotalsMap, grandTotal, employeeDeliveryFees, onExportData, onToggleStats, showStats }) => {
    return (
        <div className="card">
            <h2>Employee Statistics</h2>
            <div className="stats-controls">
                <button className="btn btn-secondary" onClick={onToggleStats}>
                    {showStats ? 'Hide Detailed Stats' : 'Show Detailed Stats'}
                </button>
                <button className="btn btn-secondary" onClick={onExportData}>Export Data</button>
            </div>
            <div className="employee-totals">
                {Object.entries(employeeTotalsMap).length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No employee totals to display</p>
                ) : (
                    Object.entries(employeeTotalsMap).map(([employeeName, total]) => (
                        <div key={employeeName} className="employee-total-card">
                            <div className="employee-name">{employeeName}</div>
                            <div className="employee-breakdown">
                                <div className="food-total">
                                    <span className="label">Food:</span>
                                    <span className="amount">
                                        ${(total - (employeeDeliveryFees?.[employeeName] || 0)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="delivery-fee">
                                    <span className="label">Delivery:</span>
                                    <span className="amount">
                                        ${(employeeDeliveryFees?.[employeeName] || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="total-amount">
                                    <strong>Total: ${total.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="grand-total">
                <strong>Grand Total: ${grandTotal.toFixed(2)}</strong>
            </div>
        </div>
    );
};

export default EmployeeTotals;
