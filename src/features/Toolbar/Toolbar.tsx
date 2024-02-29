import React from 'react';
import Modal from '../../components/Modal';

import useFetchData from '../../hooks/useFetchData.hook';
import useInstallTool from '../../hooks/useInstallTool.hook';
import GetIcon from '../../utils/tools.utils';

import {
    WrenchScrewdriverIcon,
    BeakerIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/solid';

const Toolbar = () => {
    const { dataTools, setDataTools, loading, error } = useFetchData();

    const {
        openInstallToolModal,
        modalInstallToolContent,
        isInstallToolModalOpen,
        closeInstallToolModal,
        handleInstall,
    } = useInstallTool(dataTools, setDataTools);

    const renderTools = () => {
        if (loading) {
            return <p>Loading...</p>;
        } else if (error) {
            return <p>Error: {error.message}</p>;
        } else if (
            !dataTools ||
            !dataTools.tools ||
            dataTools.tools.length === 0
        ) {
            return (
                <div className='flex items-center text-white/50'>
                    <small className=' mr-2'>Click to install tools</small>
                    <ArrowRightIcon className='w-3 h-3 relative animate-bounce-left-right' />
                </div>
            );
        } else {
            return (
                <div className='grid direction-rtl grid-cols-4 gap-4'>
                    {dataTools?.tools
                        ?.filter((tool) => tool.installed)
                        .map((tool, index) => (
                            <dl
                                className='flex flex-col items-center'
                                key={index}
                            >
                                <dt className='text-xxs uppercase text-orange hover:text-white'>
                                    {tool.label}
                                </dt>
                                <dd className='flex items-center justify-center h-6'>
                                    <GetIcon type={tool.label} />
                                </dd>
                            </dl>
                        ))}
                </div>
            );
        }
    };

    return (
        <>
            <header className='flex p-4 bg-black'>
                <h1 className='flex font-display text-3xl'>
                    <BeakerIcon className='h-8 w-8' />
                </h1>
                <div className='flex grow justify-between ml-6 pl-6 border-white/25 border-l'>
                    <div className='flex grow gap-12 justify-between mr-6 pr-6 border-inherit border-r'>
                        <div className='flex gap-6'></div>
                        {renderTools()}
                    </div>
                    <div className='flex gap-2 items-center'>
                        <WrenchScrewdriverIcon
                            className='h-4 w-4 text-white hover:text-orange transition cursor-pointer'
                            title='Tools'
                            onClick={() => openInstallToolModal()}
                        />
                    </div>
                </div>
            </header>

            <Modal
                isOpen={isInstallToolModalOpen}
                onClose={closeInstallToolModal}
                title='Install New Tool'
                actionButton={{
                    label: 'Install Tool',
                    onClick: async (event) => {
                        event.preventDefault();
                        const selectedTools = dataTools?.tools?.filter(
                            (tool) => tool.isChecked
                        );
                        if (selectedTools && selectedTools.length > 0) {
                            for (const tool of selectedTools) {
                                await handleInstall(tool.label, true);
                            }
                        }
                    },
                }}
                dismissable
            >
                {modalInstallToolContent}
            </Modal>
        </>
    );
};

export default Toolbar;
