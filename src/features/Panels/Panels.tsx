import React, { useEffect } from 'react';
import { Banner, Card } from 'flowbite-react';
import { PlusIcon } from '@heroicons/react/24/solid';

import Panel from './Panel';

import useFetchData from '../../hooks/useFetchData.hook';
import useCreatePanel from '../../hooks/useCreatePanel.hook';

import Modal from '../../components/Modal';

const Panels: React.FC = () => {
    const { dataPanels, loading, error, fetchData } = useFetchData();

    const {
        openCreatePanelModal,
        closeCreatePanelModal,
        isCreatePanelModalOpen,
        modalCreatePanelContent,
        handleCreatePanel,
    } = useCreatePanel(fetchData);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderPanels = () => {
        if (loading) {
            return <p>Loading...</p>;
        } else if (error) {
            return (
                <Banner className='flex justify-center bg-iron text-failure p-4 rounded shadow'>
                    <p>Error: {error.message}</p>
                </Banner>
            );
        } else if (
            !dataPanels ||
            !dataPanels.panels ||
            dataPanels.panels.length === 0
        ) {
            return (
                <>
                    <Banner
                        className='flex justify-center bg-iron/25 hover:bg-iron text-white p-4 rounded shadow  transition cursor-pointer'
                        onClick={openCreatePanelModal}
                    >
                        <div className='flex flex-col justify-center items-center content-center h-full '>
                            <p className='mb-6'>Currently no data available</p>
                            <PlusIcon className='h-16 w-16 text-white/50' />
                            <p>Add a panel</p>
                        </div>
                    </Banner>
                </>
            );
        } else {
            return (
                <div className='grid grid-cols-3 gap-2 mb-3 auto-rows-fr'>
                    {dataPanels.panels.map((panel, index) => (
                        <Panel key={index} panel={panel} />
                    ))}
                    <Card
                        className='bg-iron border-0 shadow opacity-25 hover:opacity-100 transition cursor-pointer'
                        onClick={openCreatePanelModal}
                    >
                        <div className='flex flex-col justify-center items-center content-center h-full'>
                            <PlusIcon className='h-16 w-16 text-white/50 hover:text-orange transition cursor-pointer' />
                            <p>Add a panel</p>
                        </div>
                    </Card>
                </div>
            );
        }
    };

    return (
        <>
            <div className='p-4'>{renderPanels()}</div>

            <Modal
                isOpen={isCreatePanelModalOpen}
                onClose={closeCreatePanelModal}
                title='Create New Panel'
                actionButton={{
                    label: 'Create Panel',
                    onClick: handleCreatePanel,
                }}
                dismissable
            >
                {modalCreatePanelContent}
            </Modal>
        </>
    );
};

export default Panels;
