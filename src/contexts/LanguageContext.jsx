import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        // Common UI Elements
        common: {
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
            noData: 'No data available',
            qty: 'Qty',
            settings: 'Settings',
            backToHome: 'Back to Home',
            selectAll: 'Select All',
            clearSelection: 'Clear Selection',
            employeeName: 'Employee Name',
            foodItem: 'Food Item',
            actions: 'Actions',
            selectRow: 'Select Row',
            product: 'Product',
            subtotal: 'Subtotal',
            delivery: 'Delivery',
            food: 'Food',
            hide: 'Hide',
            show: 'Show',
            info: 'Info',
            items: 'Items',
            restore: 'Restore',
            importing: 'Importing...'
        },

        // Navigation
        navigation: {
            analytics: 'Analytics',
            employeesNav: 'Employees',
            orders: 'Orders',
            newOrder: 'New Order',
            orderHistory: 'Order History',
            darkMode: 'Dark Mode',
            lightMode: 'Light Mode',
            language: 'Language'
        },

        // Order Management
        orders: {
            orderDetails: 'Order Details',
            editOrder: 'Edit Order',
            createNewOrder: 'Create New Order',
            orderName: 'Order Name',
            orderNamePlaceholder: 'e.g., Lunch Order - Restaurant Name',
            deliveryFee: 'Delivery Fee',
            products: 'Products',
            addEmployeeToOrder: 'Add Employee to Order',
            productRows: 'Products',
            addProduct: 'Add Product',
            productName: 'Product name',
            orderSummary: 'Order Summary',
            subtotalFood: 'Subtotal (Food)',
            deliveryFeePerPerson: 'Delivery Fee Per Person',
            totalOrderAmount: 'Total Order Amount',
            employeeBreakdown: 'Employee Breakdown',
            updateOrder: 'Update Order',
            createOrder: 'Create Order',
            clearForm: 'Clear Form',
            pleaseAddEmployeeWithProducts: 'Please add at least one employee with products.',
            noOrdersYet: 'No orders yet. Create your first order!',
            viewDetails: 'View Details',
            editOrderTooltip: 'Edit Order',
            deleteOrderTooltip: 'Delete Order',
            bulkDelete: 'Bulk Delete',
            totalAmount: 'Total Amount',
            totalItems: 'Total Items',
            orderCount: 'Order Count'
        },

        // Employee Management
        employees: {
            employeeManagement: 'Employee Management',
            addAndManageTeam: 'Add and manage your team members',
            totalEmployees: 'Total Employees',
            welcomeLetsSetupTeam: 'Welcome! Let\'s set up your team',
            startByAddingEmployees: 'Start by adding your employees. You can add as many as you need, then proceed to create orders.',
            gotIt: 'Got it!',
            searchEmployees: 'Search employees...',
            addEmployee: 'Add Employee',
            addNewEmployee: 'Add New Employee',
            enterEmployeeName: 'Enter employee name',
            pressEnterToAdd: 'Press Enter to add quickly',
            remove: 'Remove',
            noEmployeesFound: 'No employees found',
            tryAdjustingSearch: 'Try adjusting your search',
            addFirstEmployee: 'Add First Employee',
            employeeNameHeader: 'Employee Name',
            addedDate: 'Added Date',
            actionsHeader: 'Actions',
            readyToCreateOrders: 'Ready to create orders?',
            employeesInTeam: 'You have {count} employee{plural} in your team',
            proceedToOrders: 'Proceed to Orders',
            pleaseEnterEmployeeName: 'Please enter an employee name',
            employeeAlreadyExists: 'This employee already exists',
            employeeAddedSuccessfully: 'Employee added successfully!',
            employeeRemovedSuccessfully: 'Employee removed successfully!',
            employeeStatistics: 'Employee Statistics',
            hideDetailedStats: 'Hide Detailed Stats',
            showDetailedStats: 'Show Detailed Stats',
            noEmployeeTotals: 'No employee totals to display',
            employeeTotals: 'Employee Totals',
            grandTotal: 'Grand Total'
        },

        // Food Table
        table: {
            selectedItems: 'Selected Items',
            noFoodItemsMessage: 'No food items available. Start by adding your first order!',
            addFirstItem: 'Add First Item'
        },

        // Analytics
        analytics: {
            employeeCostAnalysis: 'Employee Cost Analysis',
            totalOrders: 'Total Orders',
            averageOrderValue: 'Average Order Value',
            mostExpensiveOrder: 'Most Expensive Order',
            cheapestOrder: 'Cheapest Order',
            orderFrequency: 'Order Frequency',
            itemPriceComparison: 'Item Price Comparison',
            monthlyTrends: 'Monthly Trends',
            ordersCount: 'Orders',
            avgOrder: 'Avg Order',
            avgItem: 'Avg Item',
            totalCost: 'Total Cost',
            numberOfOrders: 'Number of Orders',
            avgOrderValue: 'Avg Order Value',
            avgItemPrice: 'Avg Item Price',
            cost: 'Cost'
        },

        // Storage Management
        storage: {
            dataStorageManagement: 'Data Storage Management',
            storageUsage: 'Storage Usage',
            totalSize: 'Total Size',
            storageFoodItems: 'Food Items',
            backups: 'Backups',
            showInfo: 'Show Info',
            hideInfo: 'Hide Info',
            exportImport: 'Export/Import',
            storageExportData: 'Export Data',
            storageImportData: 'Import Data',
            importing: 'Importing...',
            backupManagement: 'Backup Management',
            createBackup: 'Create Backup',
            clearAllData: 'Clear All Data',
            availableBackups: 'Available Backups',
            storageItems: 'Items',
            storageDelete: 'Delete',
            storageOverview: 'Storage Overview',
            totalDataStored: 'Total Data Stored',
            totalBackups: 'Total Backups',
            backupDescription: 'Create and manage backup copies',
            dataHistory: 'Data History',
            dataHistoryDescription: 'View detailed information about your data',
            showDetails: 'Show Details',
            hideDetails: 'Hide Details',
            manageDataAndBackups: 'Manage your data and create backups',
            dataExportedSuccessfully: 'Data exported successfully!',
            dataImportedSuccessfully: 'Data imported successfully!',
            invalidDataFormat: 'Invalid data format!',
            failedToImportFile: 'Failed to import file: ',
            backupCreatedSuccessfully: 'Backup created successfully!',
            backupRestoredSuccessfully: 'Backup restored successfully!',
            failedToRestoreBackup: 'Failed to restore backup!',
            backupDeletedSuccessfully: 'Backup deleted successfully!',
            areYouSureRestoreBackup: 'Are you sure you want to restore this backup? Current data will be replaced.',
            areYouSureDeleteBackup: 'Are you sure you want to delete this backup?',
            areYouSureClearAllData: 'Are you sure you want to clear all data? This action cannot be undone.'
        },

        // Modal
        modal: {
            areYouSureDelete: 'Are you sure you want to delete this item? This action cannot be undone.',
            areYouSureDeleteMultiple: 'Are you sure you want to delete {count} items? This action cannot be undone.'
        },

        // App specific
        app: {
            failedToSaveOrder: 'Failed to save order: ',
            unknown: 'Unknown'
        }
    },

    ar: {
        // Common UI Elements
        common: {
            title: 'يلا فطور ',
            subtitle: 'تتبع مصاريف الطعام حسب الموظف',
            addFoodItems: 'إضافة عناصر الطعام',
            employees: 'الموظفين',
            selectEmployee: 'اختر الموظف...',
            foodItems: 'عناصر الطعام',
            foodItemName: 'اسم عنصر الطعام',
            quantity: 'الكمية',
            price: 'السعر',
            addItem: 'إضافة عنصر',
            removeItem: 'حذف عنصر',
            save: 'حفظ',
            cancel: 'إلغاء',
            edit: 'تعديل',
            delete: 'حذف',
            total: 'الإجمالي',
            noData: 'لا توجد بيانات',
            qty: 'الكمية',
            settings: 'الإعدادات',
            backToHome: 'العودة للرئيسية',
            selectAll: 'تحديد الكل',
            clearSelection: 'مسح التحديد',
            employeeName: 'اسم الموظف',
            foodItem: 'عنصر الطعام',
            actions: 'الإجراءات',
            selectRow: 'تحديد الصف',
            product: 'المنتج',
            subtotal: 'المجموع الفرعي',
            delivery: 'التوصيل',
            food: 'الطعام',
            hide: 'إخفاء',
            show: 'عرض',
            info: 'معلومات',
            items: 'العناصر',
            restore: 'استعادة',
            importing: 'جاري الاستيراد...'
        },

        // Navigation
        navigation: {
            analytics: 'التحليلات',
            employeesNav: 'الموظفين',
            orders: 'الطلبات',
            newOrder: 'طلب جديد',
            orderHistory: 'سجل الطلبات',
            darkMode: 'الوضع الليلي',
            lightMode: 'الوضع النهاري',
            language: 'اللغة'
        },

        // Order Management
        orders: {
            orderDetails: 'تفاصيل الطلب',
            editOrder: 'تعديل الطلب',
            createNewOrder: 'إنشاء طلب جديد',
            orderName: 'اسم الطلب',
            orderNamePlaceholder: 'مثال: طلب الغداء - اسم المطعم',
            deliveryFee: 'رسوم التوصيل',
            products: 'المنتجات',
            addEmployeeToOrder: 'إضافة موظف للطلب',
            productRows: 'المنتجات',
            addProduct: 'إضافة منتج',
            productName: 'اسم المنتج',
            orderSummary: 'ملخص الطلب',
            subtotalFood: 'المجموع الفرعي (الطعام)',
            deliveryFeePerPerson: 'رسوم التوصيل للشخص',
            totalOrderAmount: 'إجمالي مبلغ الطلب',
            employeeBreakdown: 'تفصيل الموظف',
            updateOrder: 'تحديث الطلب',
            createOrder: 'إنشاء طلب',
            clearForm: 'مسح النموذج',
            pleaseAddEmployeeWithProducts: 'يرجى إضافة موظف واحد على الأقل مع منتجات.',
            noOrdersYet: 'لا توجد طلبات بعد. أنشئ طلبك الأول!',
            viewDetails: 'عرض التفاصيل',
            editOrderTooltip: 'تعديل الطلب',
            deleteOrderTooltip: 'حذف الطلب',
            bulkDelete: 'حذف جماعي',
            totalAmount: 'المبلغ الإجمالي',
            totalItems: 'إجمالي العناصر',
            orderCount: 'عدد الطلبات'
        },

        // Employee Management
        employees: {
            employeeManagement: 'إدارة الموظفين',
            addAndManageTeam: 'إضافة وإدارة أعضاء فريقك',
            totalEmployees: 'إجمالي الموظفين',
            welcomeLetsSetupTeam: 'مرحباً! لنقم بإعداد فريقك',
            startByAddingEmployees: 'ابدأ بإضافة الموظفين. يمكنك إضافة العدد الذي تريده، ثم المتابعة لإنشاء الطلبات.',
            gotIt: 'فهمت!',
            searchEmployees: 'البحث عن الموظفين...',
            addEmployee: 'إضافة موظف',
            addNewEmployee: 'إضافة موظف جديد',
            enterEmployeeName: 'أدخل اسم الموظف',
            pressEnterToAdd: 'اضغط Enter للإضافة السريعة',
            remove: 'إزالة',
            noEmployeesFound: 'لم يتم العثور على موظفين',
            tryAdjustingSearch: 'حاول تعديل البحث',
            addFirstEmployee: 'إضافة أول موظف',
            employeeNameHeader: 'اسم الموظف',
            addedDate: 'تاريخ الإضافة',
            actionsHeader: 'الإجراءات',
            readyToCreateOrders: 'هل أنت مستعد لإنشاء الطلبات؟',
            employeesInTeam: 'لديك {count} موظف{plural} في فريقك',
            proceedToOrders: 'المتابعة للطلبات',
            pleaseEnterEmployeeName: 'يرجى إدخال اسم الموظف',
            employeeAlreadyExists: 'هذا الموظف موجود بالفعل',
            employeeAddedSuccessfully: 'تمت إضافة الموظف بنجاح!',
            employeeRemovedSuccessfully: 'تمت إزالة الموظف بنجاح!',
            employeeStatistics: 'إحصائيات الموظفين',
            hideDetailedStats: 'إخفاء الإحصائيات التفصيلية',
            showDetailedStats: 'عرض الإحصائيات التفصيلية',
            noEmployeeTotals: 'لا توجد إجماليات للموظفين لعرضها',
            employeeTotals: 'إجماليات الموظفين',
            grandTotal: 'الإجمالي العام'
        },

        // Food Table
        table: {
            selectedItems: 'العناصر المحددة',
            noFoodItemsMessage: 'لا توجد عناصر طعام متاحة. ابدأ بإضافة طلبك الأول!',
            addFirstItem: 'إضافة أول عنصر'
        },

        // Analytics
        analytics: {
            employeeCostAnalysis: 'تحليل تكاليف الموظفين',
            totalOrders: 'إجمالي الطلبات',
            averageOrderValue: 'متوسط قيمة الطلب',
            mostExpensiveOrder: 'أغلى طلب',
            cheapestOrder: 'أرخص طلب',
            orderFrequency: 'تكرار الطلبات',
            itemPriceComparison: 'مقارنة أسعار العناصر',
            monthlyTrends: 'الاتجاهات الشهرية',
            ordersCount: 'الطلبات',
            avgOrder: 'متوسط الطلب',
            avgItem: 'متوسط العنصر',
            totalCost: 'التكلفة الإجمالية',
            numberOfOrders: 'عدد الطلبات',
            avgOrderValue: 'متوسط قيمة الطلب',
            avgItemPrice: 'متوسط سعر العنصر',
            cost: 'التكلفة'
        },

        // Storage Management
        storage: {
            dataStorageManagement: 'إدارة تخزين البيانات',
            storageUsage: 'استخدام التخزين',
            totalSize: 'الحجم الكلي',
            storageFoodItems: 'عناصر الطعام',
            backups: 'النسخ الاحتياطية',
            showInfo: 'عرض المعلومات',
            hideInfo: 'إخفاء المعلومات',
            exportImport: 'تصدير/استيراد',
            storageExportData: 'تصدير البيانات',
            storageImportData: 'استيراد البيانات',
            importing: 'جاري الاستيراد...',
            backupManagement: 'إدارة النسخ الاحتياطية',
            createBackup: 'إنشاء نسخة احتياطية',
            clearAllData: 'مسح جميع البيانات',
            availableBackups: 'النسخ الاحتياطية المتاحة',
            storageItems: 'العناصر',
            storageDelete: 'حذف',
            storageOverview: 'نظرة عامة على التخزين',
            totalDataStored: 'إجمالي البيانات المخزنة',
            totalBackups: 'إجمالي النسخ الاحتياطية',
            backupDescription: 'إنشاء وإدارة نسخ احتياطية',
            dataHistory: 'سجل البيانات',
            dataHistoryDescription: 'عرض معلومات تفصيلية عن بياناتك',
            showDetails: 'عرض التفاصيل',
            hideDetails: 'إخفاء التفاصيل',
            manageDataAndBackups: 'إدارة بياناتك وإنشاء نسخ احتياطية',
            dataExportedSuccessfully: 'تم تصدير البيانات بنجاح!',
            dataImportedSuccessfully: 'تم استيراد البيانات بنجاح!',
            invalidDataFormat: 'تنسيق البيانات غير صالح!',
            failedToImportFile: 'فشل في استيراد الملف: ',
            backupCreatedSuccessfully: 'تم إنشاء النسخة الاحتياطية بنجاح!',
            backupRestoredSuccessfully: 'تم استعادة النسخة الاحتياطية بنجاح!',
            failedToRestoreBackup: 'فشل في استعادة النسخة الاحتياطية!',
            backupDeletedSuccessfully: 'تم حذف النسخة الاحتياطية بنجاح!',
            areYouSureRestoreBackup: 'هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.',
            areYouSureDeleteBackup: 'هل أنت متأكد من حذف هذه النسخة الاحتياطية؟',
            areYouSureClearAllData: 'هل أنت متأكد من مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.'
        },

        // Modal
        modal: {
            areYouSureDelete: 'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.',
            areYouSureDeleteMultiple: 'هل أنت متأكد من حذف {count} عناصر؟ لا يمكن التراجع عن هذا الإجراء.'
        },

        // App specific
        app: {
            failedToSaveOrder: 'فشل في حفظ الطلب: ',
            unknown: 'غير معروف'
        }
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
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || 'en';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[language];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        // If the resolved value is an object, log error and return the key string
        if (typeof value === 'object' && value !== null) {
            console.error(`Translation key "${key}" resolved to an object instead of a string. Available keys:`, Object.keys(value));
            return key; // Return the key as fallback
        }
        
        return value || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
