import React, { useState } from 'react';
import { Download, Upload, Database, Trash2, RefreshCw, Info } from 'lucide-react';
import { storage, backup, exportToFile, importFromFile } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';

const StorageManager = ({ foodItems, onImportData, onClearData }) => {
    const { t } = useLanguage();
    const [isImporting, setIsImporting] = useState(false);
    const [storageInfo, setStorageInfo] = useState(null);
    const [backups, setBackups] = useState([]);
    const [showInfo, setShowInfo] = useState(false);

    React.useEffect(() => {
        loadStorageInfo();
        loadBackups();
    }, []);

    const loadStorageInfo = () => {
        const info = storage.getStorageInfo();
        setStorageInfo(info);
    };

    const loadBackups = () => {
        const allBackups = backup.getAll();
        setBackups(allBackups.reverse()); // Show newest first
    };

    const handleExport = () => {
        const success = exportToFile(foodItems, `food_items_${new Date().toISOString().split('T')[0]}.json`);
        if (success) {
            alert(t('storage.dataExportedSuccessfully'));
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const data = await importFromFile(file);
            const success = onImportData(data);
            
            if (success) {
                alert(t('storage.dataImportedSuccessfully'));
                loadStorageInfo();
                loadBackups();
            } else {
                alert(t('storage.invalidDataFormat'));
            }
        } catch (error) {
            alert(t('storage.failedToImportFile') + error.message);
        } finally {
            setIsImporting(false);
            event.target.value = ''; // Reset file input
        }
    };

    const handleCreateBackup = () => {
        const backupData = backup.create(foodItems, `Manual_${new Date().toISOString().split('T')[0]}`);
        if (backupData) {
            alert(t('storage.backupCreatedSuccessfully'));
            loadBackups();
            loadStorageInfo();
        }
    };

    const handleRestoreBackup = (backupId) => {
        if (window.confirm(t('storage.areYouSureRestoreBackup'))) {
            const data = backup.restore(backupId);
            if (data) {
                const success = onImportData(data);
                if (success) {
                    alert(t('storage.backupRestoredSuccessfully'));
                    loadStorageInfo();
                }
            } else {
                alert(t('storage.failedToRestoreBackup'));
            }
        }
    };

    const handleDeleteBackup = (backupId) => {
        if (window.confirm(t('storage.areYouSureDeleteBackup'))) {
            const success = backup.delete(backupId);
            if (success) {
                alert(t('storage.backupDeletedSuccessfully'));
                loadBackups();
                loadStorageInfo();
            }
        }
    };

    const handleClearAll = () => {
        if (window.confirm(t('storage.areYouSureClearAllData'))) {
            onClearData();
            loadStorageInfo();
            loadBackups();
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="storage-manager">
            <div className="storage-header">
                <h3>
                    <Database size={20} />
                    {t('storage.dataStorageManagement')}
                </h3>
                <button 
                    className="btn btn-secondary"
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <Info size={16} />
                    {showInfo ? t('common.hide') : t('common.show')} {t('common.info')}
                </button>
            </div>

            {showInfo && storageInfo && (
                <div className="storage-info">
                    <div className="info-card">
                        <h4>{t('storage.storageUsage')}</h4>
                        <p>{t('storage.totalSize')}: {storageInfo.totalSizeFormatted}</p>
                        <p>{t('storage.storageFoodItems')}: {foodItems.length}</p>
                        <p>{t('storage.backups')}: {backups.length}</p>
                    </div>
                </div>
            )}

            <div className="storage-actions">
                <div className="action-group">
                    <h4>{t('storage.exportImport')}</h4>
                    <div className="action-buttons">
                        <button 
                            className="btn btn-primary"
                            onClick={handleExport}
                            disabled={foodItems.length === 0}
                        >
                            <Download size={16} />
                            {t('storage.storageExportData')}
                        </button>
                        <label className="btn btn-secondary">
                            <Upload size={16} />
                            {isImporting ? t('common.importing') : t('storage.storageImportData')}
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                disabled={isImporting}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>

                <div className="action-group">
                    <h4>{t('storage.backupManagement')}</h4>
                    <div className="action-buttons">
                        <button 
                            className="btn btn-secondary"
                            onClick={handleCreateBackup}
                            disabled={foodItems.length === 0}
                        >
                            <RefreshCw size={16} />
                            {t('storage.createBackup')}
                        </button>
                        <button 
                            className="btn btn-danger"
                            onClick={handleClearAll}
                            disabled={foodItems.length === 0}
                        >
                            <Trash2 size={16} />
                            {t('storage.clearAllData')}
                        </button>
                    </div>
                </div>
            </div>

            {backups.length > 0 && (
                <div className="backups-list">
                    <h4>{t('storage.availableBackups')}</h4>
                    <div className="backups-grid">
                        {backups.map(backup => (
                            <div key={backup.id} className="backup-card">
                                <div className="backup-info">
                                    <h5>{backup.name}</h5>
                                    <p>{formatDate(backup.timestamp)}</p>
                                    <p>{t('common.items')}: {backup.data?.length || 0}</p>
                                </div>
                                <div className="backup-actions">
                                    <button 
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleRestoreBackup(backup.id)}
                                    >
                                        {t('common.restore')}
                                    </button>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteBackup(backup.id)}
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorageManager;
