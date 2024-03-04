import React, { useEffect } from 'react';
import { Banner } from 'flowbite-react';
import { PlusIcon } from '@heroicons/react/24/solid';

import useFetchData from '../../hooks/useFetchData.hook';
import useCreateFilter from '../../hooks/useCreateFilter.hook';

import Filter from './Filter';
import Modal from '../../components/Modal';

const Filters: React.FC = () => {
    const { dataFilters, loading, error, fetchData } = useFetchData();
    const {
        openCreateFilterModal,
        closeCreateFilterModal,
        isCreateFilterModalOpen,
        modalCreateFilterContent,
        handleCreateFilter,
    } = useCreateFilter(fetchData);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderFilters = () => {
        if (loading) {
            return <p>Loading...</p>;
        } else if (error) {
            return (
                <Banner className='flex justify-center bg-iron text-failure p-4 rounded shadow'>
                    <p>Error: {error.message}</p>
                </Banner>
            );
        } else if (
            !dataFilters ||
            !dataFilters.filters ||
            dataFilters.filters.length === 0
        ) {
            return (
                <>
                    <Banner
                        className='flex justify-center bg-iron/25 hover:bg-iron text-white p-4 rounded shadow  transition cursor-pointer'
                        onClick={openCreateFilterModal}
                    >
                        <div className='flex flex-col justify-center items-center content-center h-full '>
                            <p className='mb-6'>Currently no data available</p>
                            <p>Add a filter</p>
                        </div>
                    </Banner>
                </>
            );
        } else {
            return (
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        {dataFilters.filters.map((filter, index) => (
                            <Filter
                                key={index}
                                filterTag={filter}
                                id={filter.id}
                                activated={filter.activated}
                            />
                        ))}

                        <button
                            onClick={openCreateFilterModal}
                            className='bg-white/10  hover:bg-white/20 border border-dashed border-white/20 text-white/40 rounded flex items-center px-4 text-xs'
                        >
                            Add a filter{' '}
                            <PlusIcon className='ml-2 h-4 w-4 text-white/4' />
                        </button>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div className='p-4'>{renderFilters()}</div>
            <Modal
                isOpen={isCreateFilterModalOpen}
                onClose={closeCreateFilterModal}
                title='Create New Filter'
                actionButton={{
                    label: 'Create Filter',
                    onClick: handleCreateFilter,
                }}
                dismissable
            >
                {modalCreateFilterContent}
            </Modal>
        </>
    );
};

export default Filters;
