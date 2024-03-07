import React, { useState, useRef, useEffect } from 'react';

import { IPanels, IPanel, IUpdatePanelHook } from '../types/panels.types';
import { useMutation } from '@apollo/client';
import { UpdatePanelInput } from '../graphql/types';

import { UPDATE_PANEL } from '../graphql/mutations';

import Input from '../components/Input';

const useUpdatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>,
    data: IPanels | null
): IUpdatePanelHook => {
    const [updatePanelMutation] = useMutation(UPDATE_PANEL);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updatedPanelData, setUpdatedPanelData] = useState<UpdatePanelInput>({
        id: '',
        label: '',
        target: '',
        value: '',
        unit: '',
        original: '',
        tag: '',
    });

    const updateFocusRef = useRef<HTMLInputElement>(null);

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
        }
    };

    useEffect(() => {
        if (isUpdateModalOpen && updateFocusRef.current) {
            updateFocusRef.current.focus();
        }
    }, [isUpdateModalOpen]);

    const modalUpdateContent = (
        <>
            <Input
                name='label'
                showLabel
                onChange={(e) => handleInputChange(e, 'label')}
                value={updatedPanelData.label}
                tabIndex={1}
                ref={updateFocusRef}
            />
            <Input
                name='target'
                showLabel
                onChange={(e) => handleInputChange(e, 'target')}
                value={updatedPanelData.target}
                tabIndex={2}
            />
            <Input
                name='value'
                showLabel
                onChange={(e) => handleInputChange(e, 'value')}
                value={updatedPanelData.value}
                tabIndex={3}
            />
            <Input
                name='unit'
                showLabel
                onChange={(e) => handleInputChange(e, 'unit')}
                value={updatedPanelData.unit}
                tabIndex={4}
            />
            <Input
                name='tag'
                showLabel
                onChange={(e) => handleInputChange(e, 'tag')}
                value={updatedPanelData.tag}
                tabIndex={5}
            />
        </>
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
