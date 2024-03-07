import React, { useEffect } from 'react';
import { Banner } from 'flowbite-react';

import Panel from './Panel';
import StarterPanel from './StarterPanel';

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
                <div className='grid grid-cols-3 gap-2 mb-3 auto-rows-fr'>
                    <StarterPanel handleClick={openCreatePanelModal} />
                </div>
            );
        } else {
            return (
                <div className='grid grid-cols-3 gap-2 mb-3 auto-rows-fr'>
                    {dataPanels.panels.map((panel, index) => (
                        <Panel key={index} panel={panel} />
                    ))}
                    <StarterPanel handleClick={openCreatePanelModal} />
                </div>
            );
        }
    };

    return (
        <>
            <div className='px-4'>{renderPanels()}</div>

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
