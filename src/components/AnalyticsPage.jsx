import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateTotals, getEmployeeStats } from '../utils/calculations';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    AreaChart
} from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

const AnalyticsPage = ({ foodItems }) => {
    const { t } = useLanguage();
    const { employeeTotalsMap, grandTotal } = calculateTotals(foodItems);
    const employeeData = getEmployeeStats(foodItems);

    // Prepare data for charts
    const employeeTotalsData = Object.entries(employeeTotalsMap).map(([name, total]) => ({
        name,
        total,
        amount: total
    }));

    const pieChartData = Object.entries(employeeTotalsMap).map(([name, total]) => ({
        name,
        value: total,
        percentage: ((total / grandTotal) * 100).toFixed(1)
    }));

    const orderCountData = Object.entries(employeeData).map(([name, data]) => ({
        name,
        orders: data.orderCount,
        items: data.totalQuantity
    }));

    const avgOrderData = Object.entries(employeeData).map(([name, data]) => ({
        name,
        avgOrder: data.orderCount > 0 ? data.totalAmount / data.orderCount : 0,
        avgItem: data.totalQuantity > 0 ? data.totalAmount / data.totalQuantity : 0
    }));

    if (foodItems.length === 0) {
        return (
            <div className="analytics-page">
                <div className="no-data-message">
                    <h2>{t('analytics')}</h2>
                    <p>{t('noData')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <h2>{t('analytics')}</h2>
                <div className="analytics-summary">
                    <div className="summary-card">
                        <h3>Total Items</h3>
                        <p>{foodItems.length}</p>
                    </div>
                    <div className="summary-card">
                        <h3>{t('grandTotal')}</h3>
                        <p>${grandTotal.toFixed(2)}</p>
                    </div>
                    <div className="summary-card">
                        <h3>Employees</h3>
                        <p>{Object.keys(employeeTotalsMap).length}</p>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Employee Costs Bar Chart */}
                <div className="chart-container">
                    <h3>Employee Costs</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={employeeTotalsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="total" fill="#667eea" name="Total Cost" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Cost Distribution Pie Chart */}
                <div className="chart-container">
                    <h3>Cost Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders and Items Comparison */}
                <div className="chart-container">
                    <h3>Orders & Items Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={orderCountData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="orders" fill="#764ba2" name="Number of Orders" />
                            <Bar dataKey="items" fill="#f59e0b" name="Total Items" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Average Values */}
                <div className="chart-container">
                    <h3>Average Values Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={avgOrderData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="avgOrder" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                name="Avg Order Value"
                            />
                            <Line 
                                type="monotone" 
                                dataKey="avgItem" 
                                stroke="#ef4444" 
                                strokeWidth={2}
                                name="Avg Item Price"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Cumulative Cost Area Chart */}
                <div className="chart-container full-width">
                    <h3>Cumulative Cost Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={employeeTotalsData.sort((a, b) => b.total - a.total)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            <Area 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#8b5cf6" 
                                fill="#8b5cf6" 
                                fillOpacity={0.6}
                                name="Cost"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Statistics Table */}
            <div className="detailed-stats-table">
                <h3>Detailed Employee Statistics</h3>
                <div className="stats-table-container">
                    <table className="stats-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Total Amount</th>
                                <th>Total Items</th>
                                <th>Orders</th>
                                <th>Avg Order</th>
                                <th>Avg Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(employeeData).map(([name, data]) => {
                                const avgOrder = data.orderCount > 0 ? data.totalAmount / data.orderCount : 0;
                                const avgItem = data.totalQuantity > 0 ? data.totalAmount / data.totalQuantity : 0;
                                
                                return (
                                    <tr key={name}>
                                        <td>{name}</td>
                                        <td>${data.totalAmount.toFixed(2)}</td>
                                        <td>{data.totalQuantity}</td>
                                        <td>{data.orderCount}</td>
                                        <td>${avgOrder.toFixed(2)}</td>
                                        <td>${avgItem.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
