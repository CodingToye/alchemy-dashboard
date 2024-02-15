import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { GET_PANELS } from '../graphql/queries';
import {
    CREATE_PANEL,
    UPDATE_PANEL,
    DELETE_PANEL,
    DELETE_ALL_PANELS,
} from '../graphql/mutations';
import {
    IPanel,
    IPanels,
    IFetchDataHook,
    ICreatePanelHook,
    IUpdatePanelHook,
    IDeletePanelHook,
} from '../types/panels.types';
import {
    CreatePanelInput,
    UpdatePanelInput,
    DeletePanelInput,
} from '../graphql/types';

import Input from '../components/Input';

export const useFetchData = (): IFetchDataHook => {
    const { data, loading, error, refetch } = useQuery(GET_PANELS, {
        fetchPolicy: 'network-only',
    });

    const fetchData = useCallback(async () => {
        try {
            await refetch();
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    }, [refetch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error: error || null, fetchData };
};

export const useCreatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): ICreatePanelHook => {
    const [createPanel] = useMutation(CREATE_PANEL);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPanelData, setNewPanelData] = useState<CreatePanelInput>({
        label: '',
        value: '',
        unit: '',
    });

    const createFocusRef = useRef<HTMLInputElement>(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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

            const result: IPanel = response.data.createPanel;

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          panels: [...(prevData.panels || []), { ...result }],
                      }
                    : { panels: [{ ...result }] }
            );

            closeModal();
        } catch (error) {
            console.log('Failed to add new panel:', error);
        }
    };

    useEffect(() => {
        console.log('change');
        if (isModalOpen && createFocusRef.current) {
            createFocusRef.current.focus();
            console.log(createFocusRef.current);
        }
    }, [isModalOpen]);

    const modalContent = (
        <>
            <Input
                name='label'
                placeholder='Label'
                onChange={handleInputChange}
                tabIndex={1}
                ref={createFocusRef}
            />
            <Input
                name='value'
                placeholder='Value'
                onChange={handleInputChange}
                tabIndex={2}
            />
            <Input
                name='unit'
                placeholder='Unit'
                onChange={handleInputChange}
                tabIndex={3}
            />
        </>
    );

    return {
        openModal,
        closeModal,
        handleInputChange,
        handleCreatePanel,
        modalContent,
        isModalOpen,
    };
};

export const useUpdatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>,
    data: IPanels | null
): IUpdatePanelHook => {
    const [_updatePanel] = useMutation(UPDATE_PANEL);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updatedPanelData, setUpdatedPanelData] = useState<UpdatePanelInput>({
        id: '',
        label: '',
        value: '',
        unit: '',
    });

    const updateFocusRef = useRef<HTMLInputElement>(null);

    const openUpdateModal = (
        id: string,
        label: string,
        value: string,
        unit: string
    ) => {
        setUpdatedPanelData((prevData) => ({
            ...prevData,
            id,
            label,
            value,
            unit,
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
            const response = await _updatePanel({
                variables: updatedPanelData,
            });

            const result: IPanel = response.data._updatePanel;

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
        console.log('change 1');
        if (isUpdateModalOpen && updateFocusRef.current) {
            updateFocusRef.current.focus();
            console.log(updateFocusRef);
        }
    }, [isUpdateModalOpen]);

    const modalUpdateContent = (
        <>
            <Input
                name='label'
                onChange={(e) => handleInputChange(e, 'label')}
                value={updatedPanelData.label}
                tabIndex={1}
                ref={updateFocusRef}
            />
            <Input
                name='value'
                onChange={(e) => handleInputChange(e, 'value')}
                value={updatedPanelData.value}
                tabIndex={2}
            />
            <Input
                name='unit'
                onChange={(e) => handleInputChange(e, 'unit')}
                value={updatedPanelData.unit}
                tabIndex={3}
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

export const useDeletePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): IDeletePanelHook => {
    const [deletePanelMutation] = useMutation(DELETE_PANEL);
    const deletePanel = async (id: string): Promise<void> => {
        const input: DeletePanelInput = { id };

        try {
            await deletePanelMutation({ variables: input });

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          panels: (prevData.panels || []).filter(
                              (panel) => panel.id !== id
                          ),
                      }
                    : null
            );
        } catch (error) {
            console.log('Failed to delete panel:', error);
        }
    };

    return { deletePanel };
};

export const useDeleteAllPanels = () => {
    const { fetchData } = useFetchData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [deleteAllPanelsMutation] = useMutation(DELETE_ALL_PANELS);

    const deleteAllPanels = useCallback(async () => {
        try {
            setLoading(true);
            await deleteAllPanelsMutation();
            await fetchData();
        } catch (error) {
            const typedError = error as Error;
            console.error('Error resetting panels:', error);
            setError(typedError);
        } finally {
            setLoading(false);
        }
    }, [fetchData, deleteAllPanelsMutation]);

    return { deleteAllPanels, loading, error };
};
