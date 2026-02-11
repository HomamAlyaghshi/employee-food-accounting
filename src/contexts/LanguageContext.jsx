import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        title: 'Yalla Breakfast',
        subtitle: 'Track food expenses by employee',
        addFoodItems: 'Add Food Items',
        employees: 'Employees',
        selectEmployee: 'Select Employee...',
        foodItems: 'Food Items',
        foodItemName: 'Food Item Name',
        quantity: 'Quantity',
        price: 'Price',
        addItem: 'Add Item',
        removeItem: 'Remove Item',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        total: 'Total',
        employeeTotals: 'Employee Totals',
        grandTotal: 'Grand Total',
        noData: 'No data available',
        analytics: 'Analytics',
        employeeCostAnalysis: 'Employee Cost Analysis',
        totalOrders: 'Total Orders',
        averageOrderValue: 'Average Order Value',
        mostExpensiveOrder: 'Most Expensive Order',
        cheapestOrder: 'Cheapest Order',
        orderFrequency: 'Order Frequency',
        itemPriceComparison: 'Item Price Comparison',
        monthlyTrends: 'Monthly Trends',
        exportData: 'Export Data',
        importData: 'Import Data',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        language: 'Language',
        bulkDelete: 'Bulk Delete',
        selectAll: 'Select All',
        totalAmount: 'Total Amount',
        totalItems: 'Total Items',
        orderCount: 'Order Count',
        avgOrderValue: 'Avg Order Value',
        avgItemPrice: 'Avg Item Price',
        orderHistory: 'Order History',
        qty: 'Qty',
        settings: 'Settings',
        backToHome: 'Back to Home',
        dataStorageManagement: 'Data Storage Management',
        storageUsage: 'Storage Usage',
        totalSize: 'Total Size',
        storageFoodItems: 'Food Items',
        storageBackups: 'Backups',
        showInfo: 'Show Info',
        hideInfo: 'Hide Info',
        exportImport: 'Export/Import',
        storageExportData: 'Export Data',
        storageImportData: 'Import Data',
        importing: 'Importing...',
        createBackup: 'Create Backup',
        clearAllData: 'Clear All Data',
        availableBackups: 'Available Backups',
        storageItems: 'Items',
        restore: 'Restore',
        storageDelete: 'Delete',
        storageOverview: 'Storage Overview',
        totalDataStored: 'Total Data Stored',
        totalItems: 'Total Items',
        totalBackups: 'Total Backups',
        backupManagement: 'Backup Management',
        backupDescription: 'Create and manage backup copies',
        dataHistory: 'Data History',
        dataHistoryDescription: 'View detailed information about your data',
        showDetails: 'Show Details',
        hideDetails: 'Hide Details',
        manageDataAndBackups: 'Manage your data and create backups'
    },
    ar: {
        title: 'يلا فطور ',
        subtitle: 'تتبع مصاريف الطعام حسب الموظف',
        addFoodItems: 'إضافة عناصر الطعام',
        employees: 'الموظفون',
        selectEmployee: 'اختر الموظف...',
        foodItems: 'عناصر الطعام',
        foodItemName: 'اسم عنصر الطعام',
        quantity: 'الكمية',
        pricePerItem: 'السعر للوحدة ($)',
        addAnotherItem: '+ إضافة عنصر آخر',
        addAllItems: 'إضافة كل العناصر',
        removeItem: 'إزالة عنصر',
        save: 'حفظ',
        cancel: 'إلغاء',
        edit: 'تعديل',
        delete: 'حذف',
        total: 'الإجمالي',
        employeeTotals: 'إجماليات الموظفين',
        grandTotal: 'المجموع الكلي',
        noData: 'لا توجد بيانات',
        analytics: 'التحليلات',
        employeeCostAnalysis: 'تحليل تكاليف الموظفين',
        totalOrders: 'إجمالي الطلبات',
        averageOrderValue: 'متوسط قيمة الطلب',
        mostExpensiveOrder: 'أغلى طلب',
        cheapestOrder: 'أرخص طلب',
        orderFrequency: 'تكرار الطلبات',
        itemPriceComparison: 'مقارنة أسعار العناصر',
        monthlyTrends: 'الاتجاهات الشهرية',
        exportData: 'تصدير البيانات',
        importData: 'استيراد البيانات',
        darkMode: 'الوضع الليلي',
        lightMode: 'الوضع النهاري',
        language: 'اللغة',
        bulkDelete: 'حذف متعدد',
        selectAll: 'تحديد الكل',
        totalAmount: 'المبلغ الإجمالي',
        totalItems: 'إجمالي العناصر',
        orderCount: 'عدد الطلبات',
        avgOrderValue: 'متوسط قيمة الطلب',
        avgItemPrice: 'متوسط سعر العنصر',
        orderHistory: 'سجل الطلبات',
        qty: 'كمية',
        settings: 'الإعدادات',
        backToHome: 'العودة للرئيسية',
        dataStorageManagement: 'إدارة تخزين البيانات',
        storageUsage: 'استخدام التخزين',
        totalSize: 'الحجم الكلي',
        storageFoodItems: 'عناصر الطعام',
        storageBackups: 'النسخ الاحتياطية',
        showInfo: 'عرض المعلومات',
        hideInfo: 'إخفاء المعلومات',
        exportImport: 'تصدير/استيراد',
        storageExportData: 'تصدير البيانات',
        storageImportData: 'استيراد البيانات',
        importing: 'جاري الاستيراد...',
        createBackup: 'إنشاء نسخة احتياطية',
        clearAllData: 'حذف جميع البيانات',
        availableBackups: 'النسخ الاحتياطية المتاحة',
        storageItems: 'العناصر',
        restore: 'استعادة',
        storageDelete: 'حذف'
    }
};

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
