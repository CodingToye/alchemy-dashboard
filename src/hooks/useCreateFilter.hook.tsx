import React, { useState, useRef, useEffect } from 'react';
import { ICreateFilterHook, IFilters, IFilter } from '../types/filters.types';
import { useMutation } from '@apollo/client';

import { CREATE_FILTER } from '../graphql/mutations';
import { CreateFilterInput } from '../graphql/types';

import Input from '../components/Input';
const useCreateFilter = (
    setData: React.Dispatch<React.SetStateAction<IFilters | null>>
): ICreateFilterHook => {
    const [createFilterMutation] = useMutation(CREATE_FILTER);
    const [isCreateFilterModalOpen, setIsCreateFilterModalOpen] =
        useState(false);
    const [newFilterData, setNewFilterData] = useState<CreateFilterInput>({
        tag: '',
        activated: false,
    });

    const createFocusRef = useRef<HTMLInputElement>(null);

    let errorMsg;

    const openCreateFilterModal = () => {
        setIsCreateFilterModalOpen(true);
    };

    const closeCreateFilterModal = () => {
        console.log('closeCreateFilterModal...');
        setIsCreateFilterModalOpen(false);
    };

    const handleInputChange = (value: string, name: string) => {
        setNewFilterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateFilter = async (): Promise<void> => {
        try {
            const response = await createFilterMutation({
                variables: newFilterData,
            });

            const result: IFilter = response.data.createFilterMutation;

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          filters: [...(prevData.filters || []), { ...result }],
                      }
                    : { filters: [{ ...result }] }
            );

            closeCreateFilterModal();
        } catch (error) {
            errorMsg = 'ERROR';
            console.log('Failed to add new filter:', error);
        }
    };

    useEffect(() => {
        if (isCreateFilterModalOpen && createFocusRef.current) {
            createFocusRef.current.focus();
        }
    }, [isCreateFilterModalOpen]);

    const modalCreateFilterContent = (
        <>
            <Input
                name='tag'
                placeholder='Filter'
                onChange={handleInputChange}
                tabIndex={1}
                ref={createFocusRef}
                errorMsg={errorMsg}
            />
        </>
    );

    return {
        openCreateFilterModal,
        closeCreateFilterModal,
        handleInputChange,
        handleCreateFilter,
        modalCreateFilterContent,
        isCreateFilterModalOpen,
    };
};

export default useCreateFilter;

// TODO Error handling client side for duplicate tags
