// Test translation keys directly
const translations = {
    en: {
        common: {
            noData: 'No data available',
            totalItems: 'Total Items',
            exportData: 'Export Data'
        },
        navigation: {
            analytics: 'Analytics'
        }
    },
    ar: {
        common: {
            noData: 'لا توجد بيانات',
            totalItems: 'إجمالي العناصر',
            exportData: 'تصدير البيانات'
        },
        navigation: {
            analytics: 'التحليلات'
        }
    }
};

const t = (key) => {
    const keys = key.split('.');
    let value = translations.en;
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    if (typeof value === 'object' && value !== null) {
        console.error(`Translation key "${key}" resolved to an object instead of a string. Available keys:`, Object.keys(value));
        return key;
    }
    
    return value || key;
};

console.log('Testing noData:', t('common.noData'));
console.log('Testing totalItems:', t('common.totalItems'));
console.log('Testing exportData:', t('common.exportData'));
console.log('Testing analytics:', t('navigation.analytics'));
console.log('Value type of analytics:', typeof t('navigation.analytics'));
console.log('Analytics keys:', Object.keys(translations.en.navigation));
