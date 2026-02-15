import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const EmployeeTotals = ({ employeeTotalsMap, grandTotal, employeeDeliveryFees, onExportData, onToggleStats, showStats }) => {
    const { t } = useLanguage();
    return (
        <div className="card">
            <h2>{t('employeeStatistics')}</h2>
            <div className="stats-controls">
                <button className="btn btn-secondary" onClick={onToggleStats}>
                    {showStats ? t('hideDetailedStats') : t('showDetailedStats')}
                </button>
                <button className="btn btn-secondary" onClick={onExportData}>{t('exportData')}</button>
            </div>
            <div className="employee-totals">
                {Object.entries(employeeTotalsMap).length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{t('noEmployeeTotals')}</p>
                ) : (
                    Object.entries(employeeTotalsMap).map(([employeeName, total]) => (
                        <div key={employeeName} className="employee-total-card">
                            <div className="employee-name">{employeeName}</div>
                            <div className="employee-breakdown">
                                <div className="food-total">
                                    <span className="label">{t('food')}:</span>
                                    <span className="amount">
                                        ${(total - (employeeDeliveryFees?.[employeeName] || 0)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="delivery-fee">
                                    <span className="label">{t('delivery')}:</span>
                                    <span className="amount">
                                        ${(employeeDeliveryFees?.[employeeName] || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="total-amount">
                                    <strong>{t('total')}: ${total.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="grand-total">
                <strong>{t('grandTotal')}: ${grandTotal.toFixed(2)}</strong>
            </div>
        </div>
    );
};

export default EmployeeTotals;
