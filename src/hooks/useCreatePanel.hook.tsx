import React, { useState } from 'react';
import { ICreatePanelHook, IPanels, IPanel } from '../types/panels.types';
import { useMutation } from '@apollo/client';

import { CREATE_PANEL } from '../graphql/mutations';
import { CreatePanelInput } from '../graphql/types';

import { useForm } from 'react-hook-form';
import Input from '../components/Input';

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
    const [newPanelData, setNewPanelData] =
        useState<CreatePanelInput>(initialData);
    const {
        register,
        handleSubmit,
        reset,
        // setFocus,
        formState: { errors },
    } = useForm<IFormValues>();

    const openCreatePanelModal = () => {
        setIsCreatePanelModalOpen(true);
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
        }
    };

    const onSubmit = (data: IFormValues) => {
        handleCreatePanel();
        reset();
    };

    const modalCreatePanelContent = (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-4 '
        >
            <Input
                inputLabel='label'
                placeholder='Label'
                onChange={handleInputChange}
                tabIndex={1}
                register={register}
                validationSchema={{
                    required: 'Label is required...',
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
                    required: 'Target is required...',
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
                <input
                    type='submit'
                    value='Create Panel'
                    className='rounded py-2 px-4 text-white bg-orange'
                />
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

// TODO Check for duplicate labels, add UNIQUE in sql statement
// TODO setFocus on 1st field
// TODO Add 'enter' key as a way to shortcut the click event
// TODO Prevent empty tag being sent to filters table if it field has not been populated
// TODO Add max-length for all fields
