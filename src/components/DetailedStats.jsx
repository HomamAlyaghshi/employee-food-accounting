import React from 'react';

const DetailedStats = ({ employeeData }) => {
    return (
        <div className="card">
            <h2>Detailed Employee Statistics</h2>
            <div className="detailed-stats">
                {Object.keys(employeeData).length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No data available for statistics</p>
                ) : (
                    Object.entries(employeeData).map(([employeeName, data]) => {
                        const averageOrderValue = data.orderCount > 0 ? data.totalAmount / data.orderCount : 0;
                        const averageItemPrice = data.totalQuantity > 0 ? data.totalAmount / data.totalQuantity : 0;
                        
                        return (
                            <div key={employeeName} className="employee-stat-card">
                                <h3>{employeeName}</h3>
                                <div className="stat-row">
                                    <div className="stat-item">
                                        <div className="stat-label">Total Amount</div>
                                        <div className="stat-value">${data.totalAmount.toFixed(2)}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">Total Items</div>
                                        <div className="stat-value">{data.totalQuantity}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">Order Count</div>
                                        <div className="stat-value">{data.orderCount}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">Avg Order Value</div>
                                        <div className="stat-value">${averageOrderValue.toFixed(2)}</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-label">Avg Item Price</div>
                                        <div className="stat-value">${averageItemPrice.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div className="item-list">
                                    <h4>Order History:</h4>
                                    {data.items.map(item => (
                                        <div key={item.id} className="item-entry">
                                            <span className="item-name">{item.foodItem}</span>
                                            <div className="item-details">
                                                <span>Qty: {item.quantity}</span>
                                                <span className="item-price">${item.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DetailedStats;
