const STORAGE_KEYS = {
    FOOD_ITEMS: 'foodItems',
    SETTINGS: 'appSettings',
    BACKUPS: 'dataBackups'
};

export const storage = {
    // Save data to localStorage
    save: (key, data) => {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.warn(`Failed to save to localStorage (${key}):`, error);
            return false;
        }
    },

    // Load data from localStorage
    load: (key, defaultValue = null) => {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return defaultValue;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.warn(`Failed to load from localStorage (${key}):`, error);
            return defaultValue;
        }
    },

    // Remove data from localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`Failed to remove from localStorage (${key}):`, error);
            return false;
        }
    },

    // Clear all localStorage data
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
            return false;
        }
    },

    // Get storage usage info
    getStorageInfo: () => {
        try {
            let totalSize = 0;
            const data = {};
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const size = localStorage[key].length + key.length;
                    totalSize += size;
                    data[key] = {
                        size: size,
                        sizeFormatted: formatBytes(size),
                        value: localStorage[key]
                    };
                }
            }
            
            return {
                totalSize,
                totalSizeFormatted: formatBytes(totalSize),
                data
            };
        } catch (error) {
            console.warn('Failed to get storage info:', error);
            return { totalSize: 0, totalSizeFormatted: '0 B', data: {} };
        }
    }
};

// Format bytes to human readable format
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Backup functionality
export const backup = {
    // Create backup of current data
    create: (data, name = null) => {
        try {
            const backups = storage.load(STORAGE_KEYS.BACKUPS, []);
            const backupData = {
                id: Date.now(),
                name: name || `Backup_${new Date().toISOString().split('T')[0]}`,
                timestamp: new Date().toISOString(),
                data: data,
                version: '1.0'
            };
            
            backups.push(backupData);
            
            // Keep only last 10 backups
            if (backups.length > 10) {
                backups.splice(0, backups.length - 10);
            }
            
            storage.save(STORAGE_KEYS.BACKUPS, backups);
            return backupData;
        } catch (error) {
            console.error('Failed to create backup:', error);
            return null;
        }
    },

    // Restore from backup
    restore: (backupId) => {
        try {
            const backups = storage.load(STORAGE_KEYS.BACKUPS, []);
            const backup = backups.find(b => b.id === backupId);
            
            if (!backup) {
                throw new Error('Backup not found');
            }
            
            return backup.data;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return null;
        }
    },

    // Get all backups
    getAll: () => {
        return storage.load(STORAGE_KEYS.BACKUPS, []);
    },

    // Delete backup
    delete: (backupId) => {
        try {
            const backups = storage.load(STORAGE_KEYS.BACKUPS, []);
            const filteredBackups = backups.filter(b => b.id !== backupId);
            storage.save(STORAGE_KEYS.BACKUPS, filteredBackups);
            return true;
        } catch (error) {
            console.error('Failed to delete backup:', error);
            return false;
        }
    }
};

// Export data to file
export const exportToFile = (data, filename = 'data.json') => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error('Failed to export to file:', error);
        return false;
    }
};

// Import data from file
export const importFromFile = (file) => {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    resolve(data);
                } catch (parseError) {
                    reject(new Error('Invalid JSON file'));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        } catch (error) {
            reject(error);
        }
    });
};
