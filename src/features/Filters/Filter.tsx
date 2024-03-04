import React, { useState } from 'react';
import Tag from '../../components/Tag';
import { XMarkIcon } from '@heroicons/react/24/solid';

import { ACTIVATE_FILTER } from '../../graphql/mutations';

import useFetchData from '../../hooks/useFetchData.hook';
import useDeleteFilter from '../../hooks/useDeleteFilter.hook';
import { useMutation } from '@apollo/client';

const Filter = ({ filterTag, id, activated }) => {
    const { dataFilters, fetchData } = useFetchData();
    const [activateFilterMutation] = useMutation(ACTIVATE_FILTER);

    const { deleteFilter } = useDeleteFilter(fetchData);

    const [deletedFilterId, setDeletedFilterId] = useState('');
    const [activatedFilter, setActivatedFilter] = useState(activated);
    const { filter } = filterTag;

    const handleActivateFilter = async () => {
        setActivatedFilter(!activatedFilter);

        try {
            await activateFilterMutation({
                variables: { id, activated: !activatedFilter },
            });
        } catch (error) {
            console.error('Failed to toggle filter activation:', error);
        }
    };
    const handleDeleteFilter = async (
        event: React.MouseEvent<HTMLButtonElement>,
        id: string
    ) => {
        event.stopPropagation();
        setDeletedFilterId(id);
        setTimeout(() => {
            deleteFilter(id, dataFilters);
        }, 500);
    };

    return (
        <>
            <Tag
                onClick={handleActivateFilter}
                activated={activatedFilter}
                extraClasses={`${
                    deletedFilterId === id
                        ? 'animate-fade-out-up'
                        : 'animate-fade-in-down'
                }`}
            >
                {filter}
                <XMarkIcon
                    className='ml-2 w-3.5 h-3.5'
                    onClick={(e) => handleDeleteFilter(e, id)}
                />
            </Tag>
        </>
    );
};

export default Filter;
