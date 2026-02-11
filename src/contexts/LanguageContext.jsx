import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        title: 'Employee Food Accounting System',
        subtitle: 'Track food expenses by employee',
        addFoodItems: 'Add Food Items',
        employeeName: 'Employee Name',
        selectEmployee: 'Select Employee...',
        foodItems: 'Food Items',
        foodItemName: 'Food Item Name',
        quantity: 'Quantity',
        pricePerItem: 'Price per Item ($)',
        addAnotherItem: '+ Add Another Item',
        addAllItems: 'Add All Items',
        clearForm: 'Clear Form',
        foodItemsTable: 'Food Items',
        employeeStatistics: 'Employee Statistics',
        showDetailedStats: 'Show Detailed Stats',
        hideDetailedStats: 'Hide Detailed Stats',
        exportData: 'Export Data',
        grandTotal: 'Grand Total',
        noData: 'No data available',
        remove: 'Remove',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        analytics: 'Analytics',
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
        settings: 'Settings'
    },
    ar: {
        title: 'نظام محاسبة طعام الموظفين',
        subtitle: 'تتبع مصاريف الطعام حسب الموظف',
        addFoodItems: 'إضافة عناصر الطعام',
        employeeName: 'اسم الموظف',
        selectEmployee: 'اختر الموظف...',
        foodItems: 'عناصر الطعام',
        foodItemName: 'اسم عنصر الطعام',
        quantity: 'الكمية',
        pricePerItem: 'السعر للوحدة ($)',
        addAnotherItem: '+ إضافة عنصر آخر',
        addAllItems: 'إضافة كل العناصر',
        clearForm: 'مسح النموذج',
        foodItemsTable: 'عناصر الطعام',
        employeeStatistics: 'إحصائيات الموظفين',
        showDetailedStats: 'عرض الإحصائيات التفصيلية',
        hideDetailedStats: 'إخفاء الإحصائيات التفصيلية',
        exportData: 'تصدير البيانات',
        grandTotal: 'الإجمالي الكلي',
        noData: 'لا توجد بيانات متاحة',
        remove: 'حذف',
        edit: 'تعديل',
        delete: 'حذف',
        save: 'حفظ',
        cancel: 'إلغاء',
        analytics: 'التحليلات',
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
        settings: 'الإعدادات'
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
