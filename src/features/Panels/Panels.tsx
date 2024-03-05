import React, { useEffect } from 'react';
import { Banner, Card, Flowbite, Progress } from 'flowbite-react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { TagIcon } from '@heroicons/react/16/solid';

import Panel from './Panel';

import useFetchData from '../../hooks/useFetchData.hook';
import useCreatePanel from '../../hooks/useCreatePanel.hook';

import type { CustomFlowbiteTheme } from 'flowbite-react';

import { valueDifference } from '../../utils/panels.utils';

import Modal from '../../components/Modal';

const customTheme: CustomFlowbiteTheme = {
    progress: {
        bar: 'bg-iron/50',
    },
};

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

    function calcPercentage(x, y) {
        return (x / y) * 100;
    }

    const progressToTarget = calcPercentage(1000, 2000);

    const renderSampleCard = () => {
        return (
            <Card
                className='bg-white/10  hover:bg-white/15 border border-dashed border-white/10 text-white/40 rounded justify-start p-3 cursor-pointer'
                onClick={openCreatePanelModal}
            >
                <header className='w-full mb-3 text-center'>
                    <h2 className='uppercase text-sm flex items-center justify-center gap-0'>
                        Click to add new panel{' '}
                        <PlusIcon className='ml-2 h-4 w-4 text-white/4' />
                    </h2>
                </header>
                <div className='text-5xl flex justify-between items-end opacity-10'>
                    <div data-testid='panel-value-test'>
                        1000
                        <small className='text-lg '>kw/h</small>
                    </div>
                </div>
                <div className='bg-charcoal p-4 rounded-md opacity-10'>
                    <div className='flex justify-between items-center mb-2 '>
                        <h2>Goal</h2>
                        <span
                            className='text-xs'
                            data-testid='panel-target-test'
                        >
                            2000
                        </span>
                    </div>
                    <div className='flex justify-end mb-2'>
                        <span>{valueDifference('0', '1000')}</span>
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
                <footer className='flex items-center px-1 opacity-10'>
                    <TagIcon className='w-3 h-3 mr-2 ' />
                    <small className=''>tag</small>
                </footer>
            </Card>
        );
    };

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
                    {renderSampleCard()}
                </div>
            );
        } else {
            return (
                <div className='grid grid-cols-3 gap-2 mb-3 auto-rows-fr'>
                    {dataPanels.panels.map((panel, index) => (
                        <Panel key={index} panel={panel} />
                    ))}
                    {renderSampleCard()}
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
