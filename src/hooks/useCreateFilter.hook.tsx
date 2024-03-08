import React, { useState } from 'react';
import { ICreateFilterHook, IFilters, IFilter } from '../types/filters.types';
import { useMutation } from '@apollo/client';

import { CREATE_FILTER } from '../graphql/mutations';
import { CreateFilterInput } from '../graphql/types';

import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface IFormValues {
    tag: string;
}

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
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<IFormValues>({ mode: 'onSubmit' });

    const openCreateFilterModal = () => {
        setIsCreateFilterModalOpen(true);
        setErrorMessage('');
        setTimeout(() => {
            setFocus('tag');
        }, 0);
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
            console.log('Failed to add new filter:', error);
            if (
                error.message.includes('UNIQUE constraint failed: filters.tag')
            ) {
                setErrorMessage(
                    'Failed to create filter as it already exists.'
                );
            } else {
                setErrorMessage('Generic error');
            }
        }
    };

    const onSubmit = () => {
        handleCreateFilter();
        reset();
    };

    const modalCreateFilterContent = (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4 '
        >
            {errorMessage && (
                <span className='text-failure p-2 flex items-center'>
                    <ExclamationTriangleIcon className='w-4 h-4 mr-2' />
                    {errorMessage}
                </span>
            )}
            <Input
                inputLabel='tag'
                placeholder='Filter'
                onChange={handleInputChange}
                tabIndex={1}
                register={register}
                validationSchema={{
                    required: 'Label is required',
                    maxLength: {
                        value: 12,
                        message: 'Please enter a maximum of 12 characters',
                    },
                }}
                required
                errors={errors}
            />

            <div className='flex flex-row justify-end text-charcoal'>
                <Button buttonType='submit'>Create Filter</Button>
            </div>
        </form>
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
