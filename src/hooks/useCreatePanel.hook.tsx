import React, { useState, useRef, useEffect } from 'react';
import { ICreatePanelHook, IPanels, IPanel } from '../types/panels.types';
import { useMutation } from '@apollo/client';

import { CREATE_PANEL } from '../graphql/mutations';
import { CreatePanelInput } from '../graphql/types';

import { useForm } from 'react-hook-form';
import Input, { IFormValues } from '../components/Input';

const useCreatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): ICreatePanelHook => {
    const [createPanelMutation] = useMutation(CREATE_PANEL);
    const [isCreatePanelModalOpen, setIsCreatePanelModalOpen] = useState(false);
    const [newPanelData, setNewPanelData] = useState<CreatePanelInput>({
        label: '',
        target: '',
        value: '',
        original: '',
        unit: '',
        tag: '',
    });
    const { register } = useForm<IFormValues>();

    const createFocusRef = useRef<HTMLInputElement>(null);

    const openCreatePanelModal = () => {
        setIsCreatePanelModalOpen(true);
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

            console.log(response);

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

    useEffect(() => {
        if (isCreatePanelModalOpen && createFocusRef.current) {
            createFocusRef.current.focus();
        }
    }, [isCreatePanelModalOpen]);

    const modalCreatePanelContent = (
        <>
            <Input
                inputLabel='label'
                placeholder='Label'
                onChange={handleInputChange}
                tabIndex={1}
                ref={createFocusRef}
                register={register}
                required
            />
            <Input
                inputLabel='target'
                placeholder='Target'
                onChange={handleInputChange}
                tabIndex={2}
                register={register}
            />
            <Input
                inputLabel='value'
                placeholder='Value'
                onChange={handleInputChange}
                tabIndex={3}
                register={register}
            />
            <Input
                inputLabel='unit'
                placeholder='Unit'
                onChange={handleInputChange}
                tabIndex={4}
                register={register}
            />
            <Input
                inputLabel='tag'
                placeholder='Tag'
                onChange={handleInputChange}
                tabIndex={5}
                register={register}
            />
        </>
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

// Check for duplicate labels, add UNIQUE in sql statement
