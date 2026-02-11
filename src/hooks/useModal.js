import { useState } from 'react';

export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});

    const openModal = (data = {}) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData({});
    };

    return {
        isModalOpen,
        modalData,
        openModal,
        closeModal
    };
};
