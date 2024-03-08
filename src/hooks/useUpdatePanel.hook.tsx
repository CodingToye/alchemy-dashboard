import React, { useState } from 'react';

import { IPanels, IPanel, IUpdatePanelHook } from '../types/panels.types';
import { useMutation } from '@apollo/client';
import { UpdatePanelInput } from '../graphql/types';

import { UPDATE_PANEL } from '../graphql/mutations';

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

const useUpdatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>,
    data: IPanels | null
): IUpdatePanelHook => {
    const [updatePanelMutation] = useMutation(UPDATE_PANEL);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [updatedPanelData, setUpdatedPanelData] = useState<UpdatePanelInput>({
        id: '',
        label: '',
        target: '',
        value: '',
        unit: '',
        original: '',
        tag: '',
    });

    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
    } = useForm<IFormValues>({ mode: 'onSubmit' });

    const openUpdateModal = (
        id: string,
        label: string,
        target: string,
        value: string,
        original: string,
        unit: string,
        tag: string
    ) => {
        setUpdatedPanelData((prevData) => ({
            ...prevData,
            id,
            label,
            target,
            value,
            original: value,
            unit,
            tag,
        }));

        setIsUpdateModalOpen(true);
        setTimeout(() => {
            setFocus('label');
        }, 0);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const handleInputChange = (value: string, name: string) => {
        setUpdatedPanelData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdatePanel = async (
        id: string,
        data: IPanels | null
    ): Promise<void> => {
        const panelToEdit = data?.panels?.find((panel) => panel.id === id);

        if (!panelToEdit) {
            console.error('Panel not found for editing');
            return;
        }

        try {
            const response = await updatePanelMutation({
                variables: updatedPanelData,
            });

            const result: IPanel = response.data.updatePanelMutation;

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          panels: (prevData.panels || []).map((panel) =>
                              panel.id === id ? { ...panel, ...result } : panel
                          ),
                      }
                    : { panels: [result] }
            );
            closeUpdateModal();
        } catch (error) {
            console.log('Failed to updated panel:', error);
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
        handleUpdatePanel(updatedPanelData.id, data);
        // reset();
    };

    const modalUpdateContent = (
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
                showLabel
                onChange={(e) => handleInputChange(e, 'label')}
                value={updatedPanelData.label}
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
                showLabel
                onChange={(e) => handleInputChange(e, 'target')}
                value={updatedPanelData.target}
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
                showLabel
                onChange={(e) => handleInputChange(e, 'value')}
                value={updatedPanelData.value}
                tabIndex={3}
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
                inputLabel='unit'
                showLabel
                onChange={(e) => handleInputChange(e, 'unit')}
                value={updatedPanelData.unit}
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
                showLabel
                onChange={(e) => handleInputChange(e, 'tag')}
                value={updatedPanelData.tag}
                tabIndex={5}
                register={register}
                errors={errors}
            />
            <div className='flex flex-row justify-end text-charcoal'>
                <Button buttonType='submit'>Update Panel</Button>
            </div>
        </form>
    );

    return {
        openUpdateModal,
        closeUpdateModal,
        handleInputChange,
        handleUpdatePanel,
        modalUpdateContent,
        isUpdateModalOpen,
        updatedPanelData,
    };
};

export default useUpdatePanel;
