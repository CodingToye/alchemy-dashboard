import React, { useState } from 'react';
import { Flowbite, Card, Progress } from 'flowbite-react';
import Modal from '../../components/Modal';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { TagIcon } from '@heroicons/react/16/solid';

import useFetchData from '../../hooks/useFetchData.hook';
import useUpdatePanel from '../../hooks/useUpdatePanel.hook';
import useDeletePanel from '../../hooks/useDeletePanel.hook';

import { valueDifference } from '../../utils/panels.utils';

import type { CustomFlowbiteTheme } from 'flowbite-react';

const customTheme: CustomFlowbiteTheme = {
    progress: {
        bar: 'bg-orange',
    },
};

const Panel = ({ panel }) => {
    const { dataPanels, fetchData } = useFetchData();
    const {
        openUpdateModal,
        closeUpdateModal,
        isUpdateModalOpen,
        updatedPanelData,
        modalUpdateContent,
        handleUpdatePanel,
    } = useUpdatePanel(fetchData, dataPanels);

    const { deletePanel } = useDeletePanel(fetchData);

    const [deletedPanelId, setDeletedPanelId] = useState('');

    const handleDeletePanel = async (id: string) => {
        setDeletedPanelId(id);
        setTimeout(() => {
            deletePanel(id, dataPanels);
        }, 500);
    };

    const { id, label, target, value, original, unit, tag } = panel;

    function calcPercentage(x, y) {
        return (x / y) * 100;
    }

    const progressToTarget = calcPercentage(value, target);
    return (
        <>
            <Card
                className={`relative p-3 bg-iron  border-0 shadow text-white ${
                    deletedPanelId === id
                        ? 'animate-fade-out-up'
                        : 'animate-fade-in-down'
                }`}
            >
                <header className='flex justify-between mb-3'>
                    <h2 className='text-orange text-sm uppercase'>{label}</h2>
                    <div className='flex items-center gap-2'>
                        <PencilIcon
                            className='h-3 w-3 text-white hover:text-orange transition cursor-pointer'
                            title='Edit'
                            onClick={() =>
                                openUpdateModal(
                                    id,
                                    label,
                                    target,
                                    value,
                                    original,
                                    unit
                                )
                            }
                        />
                        <TrashIcon
                            className='h-3 w-3 text-white hover:text-orange transition cursor-pointer'
                            title='Delete'
                            onClick={() => handleDeletePanel(id)}
                        />
                    </div>
                </header>
                <div className='text-5xl flex justify-between items-end'>
                    <div data-testid='panel-value-test'>
                        {value}
                        <small className='text-lg text-inputText'>{unit}</small>
                    </div>
                </div>
                <div className='bg-charcoal p-4 rounded-md'>
                    <div className='flex justify-between items-center mb-2 '>
                        <h2>Goal</h2>
                        <span
                            className='text-xs'
                            data-testid='panel-target-test'
                        >
                            {target}
                        </span>
                    </div>
                    <div className='flex justify-end mb-2'>
                        <span>{valueDifference(original, value)}</span>
                    </div>
                    <Flowbite theme={{ theme: customTheme }}>
                        <Progress
                            progress={progressToTarget}
                            size='lg'
                            textLabel='test'
                            color='bg-orange'
                            className='mb-2'
                        />
                    </Flowbite>
                </div>
                <footer className='flex items-center px-1'>
                    <TagIcon className='w-3 h-3 mr-2 text-white/50' />
                    <small className='text-white/50'>{tag}</small>
                </footer>
            </Card>

            <Modal
                isOpen={isUpdateModalOpen}
                onClose={closeUpdateModal}
                title='Update Panel'
                actionButton={{
                    label: 'Update Panel',
                    onClick: () =>
                        handleUpdatePanel(updatedPanelData.id, dataPanels),
                    args: [updatedPanelData.id, dataPanels],
                }}
                dismissable
            >
                {modalUpdateContent}
            </Modal>
        </>
    );
};

export default Panel;
