import React, { useState, useRef, useEffect } from 'react';
import { ICreatePanelHook, IPanels, IPanel } from '../types/panels.types';
import { useMutation } from '@apollo/client';

import { CREATE_PANEL } from '../graphql/mutations';
import { CreatePanelInput } from '../graphql/types';

import Input from '../components/Input';
const useCreatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): ICreatePanelHook => {
    const [createPanel] = useMutation(CREATE_PANEL);
    const [isCreatePanelModalOpen, setIsCreatePanelModalOpen] = useState(false);
    const [newPanelData, setNewPanelData] = useState<CreatePanelInput>({
        label: '',
        target: '',
        value: '',
        original: '',
        unit: '',
    });

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

    const handleCreatePanel = async (): Promise<void> => {
        try {
            const response = await createPanel({
                variables: newPanelData,
            });

            console.log(response);

            const result: IPanel = response.data.createPanel;

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
                name='label'
                placeholder='Label'
                onChange={handleInputChange}
                tabIndex={1}
                ref={createFocusRef}
            />
            <Input
                name='target'
                placeholder='Target'
                onChange={handleInputChange}
                tabIndex={2}
            />
            <Input
                name='value'
                placeholder='Value'
                onChange={handleInputChange}
                tabIndex={3}
            />
            <Input
                name='unit'
                placeholder='Unit'
                onChange={handleInputChange}
                tabIndex={4}
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
