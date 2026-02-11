import React from 'react';
import { Moon, Sun, Globe, Trash2, BarChart3, Home, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ModernHeader = ({ 
    currentPage, 
    onPageChange, 
    selectedItems, 
    onBulkDelete, 
    hasItems 
}) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { t, language, toggleLanguage } = useLanguage();

    const navItems = [
        { id: 'home', icon: Home, label: t('foodItems') },
        { id: 'analytics', icon: BarChart3, label: t('analytics') },
        { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <header className="modern-header">
            <div className="header-content">
                <div className="header-title">
                    <h1>{t('title')}</h1>
                    <p>{t('subtitle')}</p>
                </div>
                
                <div className="header-actions">
                    <div className="nav-buttons">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-button ${currentPage === item.id ? 'active' : ''}`}
                                onClick={() => onPageChange(item.id)}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {currentPage === 'home' && hasItems && selectedItems.length > 0 && (
                        <div className="bulk-actions">
                            <button
                                className="nav-button bulk-delete-btn"
                                onClick={onBulkDelete}
                            >
                                <Trash2 size={18} />
                                <span>{t('bulkDelete')} ({selectedItems.length})</span>
                            </button>
                        </div>
                    )}

                    <div className="theme-language-controls">
                        <button
                            className="nav-button"
                            onClick={toggleLanguage}
                        >
                            <Globe size={18} />
                            <span>{language === 'en' ? 'AR' : 'EN'}</span>
                        </button>
                        
                        <button
                            className="nav-button"
                            onClick={toggleTheme}
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            <span>{isDarkMode ? t('lightMode') : t('darkMode')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ModernHeader;
