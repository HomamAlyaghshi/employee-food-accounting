import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, Info, Settings, ArrowLeft } from 'lucide-react';
import { storage, backup, exportToFile, importFromFile } from '../utils/storage';

const SettingsPage = ({ 
    foodItems, 
    onImportData, 
    onClearData, 
    onNavigateBack,
    currentPage 
}) => {
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
            alert('Data exported successfully!');
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
                alert('Data imported successfully!');
                loadStorageInfo();
                loadBackups();
            } else {
                alert('Invalid data format!');
            }
        } catch (error) {
            alert('Failed to import file: ' + error.message);
        } finally {
            setIsImporting(false);
            event.target.value = ''; // Reset file input
        }
    };

    const handleCreateBackup = () => {
        const backupData = backup.create(foodItems, `Manual_${new Date().toISOString().split('T')[0]}`);
        if (backupData) {
            alert('Backup created successfully!');
            loadBackups();
            loadStorageInfo();
        }
    };

    const handleRestoreBackup = (backupId) => {
        if (window.confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
            const data = backup.restore(backupId);
            if (data) {
                const success = onImportData(data);
                if (success) {
                    alert('Backup restored successfully!');
                    loadStorageInfo();
                }
            } else {
                alert('Failed to restore backup!');
            }
        }
    };

    const handleDeleteBackup = (backupId) => {
        if (window.confirm('Are you sure you want to delete this backup?')) {
            const success = backup.delete(backupId);
            if (success) {
                alert('Backup deleted successfully!');
                loadBackups();
                loadStorageInfo();
            }
        }
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            onClearData();
            loadStorageInfo();
            loadBackups();
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <button 
                    className="btn btn-ghost"
                    onClick={onNavigateBack}
                >
                    <ArrowLeft size={16} />
                    Back to {currentPage === 'home' ? 'Home' : 'Analytics'}
                </button>
                <h2>
                    <Settings size={20} />
                    Settings
                </h2>
            </div>

            <div className="settings-content">
                <div className="card">
                    <div className="storage-header">
                        <h3>
                            <Database size={20} />
                            Data Storage Management
                        </h3>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => setShowInfo(!showInfo)}
                        >
                            <Info size={16} />
                            {showInfo ? 'Hide' : 'Show'} Info
                        </button>
                    </div>

                    {showInfo && storageInfo && (
                        <div className="storage-info">
                            <div className="info-card">
                                <h4>Storage Usage</h4>
                                <p>Total Size: {storageInfo.totalSizeFormatted}</p>
                                <p>Food Items: {foodItems.length}</p>
                                <p>Backups: {backups.length}</p>
                            </div>
                        </div>
                    )}

                    <div className="storage-actions">
                        <div className="action-group">
                            <h4>Export/Import</h4>
                            <div className="action-buttons">
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleExport}
                                    disabled={foodItems.length === 0}
                                >
                                    <Download size={16} />
                                    Export Data
                                </button>
                                <label className="btn btn-secondary">
                                    <Upload size={16} />
                                    {isImporting ? 'Importing...' : 'Import Data'}
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
                            <h4>Backups</h4>
                            <div className="action-buttons">
                                <button 
                                    className="btn btn-secondary"
                                    onClick={handleCreateBackup}
                                    disabled={foodItems.length === 0}
                                >
                                    <RefreshCw size={16} />
                                    Create Backup
                                </button>
                                <button 
                                    className="btn btn-danger"
                                    onClick={handleClearAll}
                                    disabled={foodItems.length === 0}
                                >
                                    <Trash2 size={16} />
                                    Clear All Data
                                </button>
                            </div>
                        </div>
                    </div>

                    {backups.length > 0 && (
                        <div className="backups-list">
                            <h4>Available Backups</h4>
                            <div className="backups-grid">
                                {backups.map(backup => (
                                    <div key={backup.id} className="backup-card">
                                        <div className="backup-info">
                                            <h5>{backup.name}</h5>
                                            <p>{formatDate(backup.timestamp)}</p>
                                            <p>Items: {backup.data?.length || 0}</p>
                                        </div>
                                        <div className="backup-actions">
                                            <button 
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleRestoreBackup(backup.id)}
                                            >
                                                Restore
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteBackup(backup.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
