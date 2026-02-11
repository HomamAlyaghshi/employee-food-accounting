import { useState, useEffect } from 'react';

export const useError = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const showError = (message) => {
        setErrorMessage(message);
    };

    const clearError = () => {
        setErrorMessage('');
    };

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    return {
        errorMessage,
        showError,
        clearError
    };
};
