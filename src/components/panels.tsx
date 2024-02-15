import React, { useEffect } from 'react';
import Button from './Button';
import {
    PlusIcon,
    ArrowPathIcon,
    PencilIcon,
    TrashIcon,
    BeakerIcon,
} from '@heroicons/react/24/solid';

import Modal from './Modal';
import {
    useFetchData,
    useCreatePanel,
    useUpdatePanel,
    useDeletePanel,
    useDeleteAllPanels,
} from '../hooks/panels.hooks';

const Panels: React.FC = () => {
    const { data, loading, error, fetchData } = useFetchData();
    const { deleteAllPanels } = useDeleteAllPanels();
    const {
        openModal,
        closeModal,
        isModalOpen,
        modalContent,
        handleCreatePanel,
    } = useCreatePanel(fetchData);

    const {
        openUpdateModal,
        closeUpdateModal,
        isUpdateModalOpen,
        modalUpdateContent,
        handleUpdatePanel,
        updatedPanelData,
    } = useUpdatePanel(fetchData, data);

    const { deletePanel } = useDeletePanel(fetchData);

    const handleDeletePanel = async (id: string) => {
        await deletePanel(id, data);
    };

    const handleDeleteAllPanels = async () => {
        await deleteAllPanels();
        await fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <header className='flex justify-between p-4 bg-black'>
                <h1 className='flex font-display text-3xl'>
                    <BeakerIcon className='h-8 w-8' />
                </h1>
                <div className='flex gap-2 items-center'>
                    <PlusIcon
                        className='h-5 w-5 text-white hover:text-bad transition cursor-pointer'
                        onClick={openModal}
                        title='Create a panel'
                    />

                    <ArrowPathIcon
                        className='h-5 w-5 text-white hover:text-bad transition cursor-pointer'
                        onClick={handleDeleteAllPanels}
                        title='Delete all panels'
                    />
                </div>
            </header>

            <div className='p-4'>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='grid grid-cols-3 gap-4 mb-3'>
                        {data &&
                        data.panels &&
                        Array.isArray(data.panels) &&
                        data.panels.length > 0 ? (
                            data.panels.map((panel, index) => (
                                <div
                                    className='relative p-3 bg-iron  shadow'
                                    key={index}
                                >
                                    <header className='flex justify-between mb-3'>
                                        <div>
                                            <h2 className='text-bad text-sm uppercase'>
                                                {panel.label}
                                            </h2>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <PencilIcon
                                                className='h-4 w-4 text-white hover:text-bad transition cursor-pointer'
                                                title='Edit'
                                                onClick={() =>
                                                    openUpdateModal(
                                                        panel.id,
                                                        panel.label,
                                                        panel.value,
                                                        panel.unit
                                                    )
                                                }
                                            />
                                            <TrashIcon
                                                className='h-4 w-4 text-white hover:text-bad transition cursor-pointer'
                                                title='Delete'
                                                onClick={() =>
                                                    handleDeletePanel(panel.id)
                                                }
                                            />
                                        </div>
                                    </header>
                                    <span className='text-5xl'>
                                        {panel.value}
                                        <small className='text-lg text-inputText'>
                                            {panel.unit}
                                        </small>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className='flex justify-center text-bad col-span-3 p-4'>
                                <p>No data available.</p>
                            </div>
                        )}
                        {error && (
                            <div style={{ color: 'red', margin: '10px' }}>
                                Error: {error.message}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title='Create New Panel'
                actionButton={{
                    label: 'Create Panel',
                    onClick: handleCreatePanel,
                }}
            >
                {modalContent}
            </Modal>

            <Modal
                isOpen={isUpdateModalOpen}
                onClose={closeUpdateModal}
                title='Update Panel'
                actionButton={{
                    label: 'Update Panel',
                    onClick: () => handleUpdatePanel(updatedPanelData.id, data),
                    args: [updatedPanelData.id, data],
                }}
            >
                {modalUpdateContent}
            </Modal>
        </>
    );
};

export default Panels;
