import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const Modal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Delete', 
    cancelText = 'Cancel',
    type = 'danger',
    icon: Icon = AlertTriangle
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title">
                        <Icon size={24} className={`modal-icon modal-icon-${type}`} />
                        <h3>{title}</h3>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                
                <div className="modal-footer">
                    <button 
                        className="btn btn-secondary modal-btn-cancel"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button 
                        className={`btn modal-btn-confirm modal-btn-${type}`}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const DeleteModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemCount, 
    itemType = 'items' 
}) => {
    const title = itemCount > 1 
        ? `Delete ${itemCount} ${itemType}` 
        : `Delete ${itemType}`;
        
    const message = itemCount > 1
        ? `Are you sure you want to delete ${itemCount} ${itemType}? This action cannot be undone.`
        : `Are you sure you want to delete this ${itemType.slice(0, -1)}? This action cannot be undone.`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title={title}
            message={message}
            confirmText="delete"
            cancelText="cancel"
            type="danger"
            icon={Trash2}
        />
    );
};

export default Modal;
