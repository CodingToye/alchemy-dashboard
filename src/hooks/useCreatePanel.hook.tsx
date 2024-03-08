import React, { useState } from 'react';
import { ICreatePanelHook, IPanels, IPanel } from '../types/panels.types';
import { useMutation } from '@apollo/client';

import { CREATE_PANEL } from '../graphql/mutations';
import { CreatePanelInput } from '../graphql/types';

import { useForm } from 'react-hook-form';
import Input from '../components/Input';
import Button from '../components/Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface IFormValues {
    label: string;
    target: string;
    value: string;
    original: string;
    unit?: string;
    tag?: string;
}

const useCreatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): ICreatePanelHook => {
    const initialData = {
        label: '',
        target: '',
        value: '',
        original: '',
        unit: '',
        tag: '',
    };
    const [createPanelMutation] = useMutation(CREATE_PANEL);
    const [isCreatePanelModalOpen, setIsCreatePanelModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newPanelData, setNewPanelData] =
        useState<CreatePanelInput>(initialData);
    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors },
    } = useForm<IFormValues>({ mode: 'onSubmit' });

    const openCreatePanelModal = () => {
        setIsCreatePanelModalOpen(true);
        setErrorMessage('');
        setTimeout(() => {
            setFocus('label');
        }, 0);
        setNewPanelData(initialData);
        reset(initialData);
    };

    const closeCreatePanelModal = () => {
        setIsCreatePanelModalOpen(false);
    };

    const handleInputChange = (value: string, name: string) => {
        setNewPanelData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreatePanel = async () => {
        try {
            const response = await createPanelMutation({
                variables: { ...newPanelData, activated: true },
            });

            const result: IPanel = response.data.createPanelMutation;

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          panels: [...(prevData.panels || []), { ...result }],
                      }
                    : { panels: [{ ...result }] }
            );

            closeCreatePanelModal();
        } catch (error) {
            console.log('Failed to add new panel:', error);
            if (
                error.message.includes('UNIQUE constraint failed: panels.label')
            ) {
                setErrorMessage('Failed to create panel as it already exists.');
            } else {
                setErrorMessage('Generic error');
            }
        }
    };

    const onSubmit = () => {
        handleCreatePanel();
        reset();
    };

    const modalCreatePanelContent = (
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
                inputLabel='label'
                placeholder='Label'
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
            <Input
                inputLabel='target'
                placeholder='Target'
                onChange={handleInputChange}
                tabIndex={2}
                register={register}
                validationSchema={{
                    required: 'Target is required',
                    maxLength: {
                        value: 6,
                        message: 'Please enter a maximum of 6 characters',
                    },
                }}
                required
                errors={errors}
            />
            <Input
                inputLabel='value'
                placeholder='Value'
                onChange={handleInputChange}
                tabIndex={3}
                register={register}
                validationSchema={{
                    required: 'Value is required...',
                    maxLength: {
                        value: 6,
                        message: 'Please enter a maximum of 6 characters',
                    },
                }}
                required
                errors={errors}
            />
            <Input
                inputLabel='unit'
                placeholder='Unit'
                onChange={handleInputChange}
                tabIndex={4}
                register={register}
                validationSchema={{
                    maxLength: {
                        value: 5,
                        message: 'Please enter a maximum of 5 characters',
                    },
                }}
                errors={errors}
            />
            <Input
                inputLabel='tag'
                placeholder='Tag'
                onChange={handleInputChange}
                tabIndex={5}
                register={register}
                errors={errors}
            />
            <div className='flex flex-row justify-end text-charcoal'>
                <Button buttonType='submit'>Create Panel</Button>
            </div>
        </form>
    );

    return {
        openCreatePanelModal,
        closeCreatePanelModal,
        handleInputChange,
        handleCreatePanel,
        modalCreatePanelContent,
        isCreatePanelModalOpen,
    };
};

export default useCreatePanel;

// TODO Add the validation on the onChange also
