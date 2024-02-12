import { useState, useEffect, useCallback } from 'react';
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

export const useFetchData = (): IFetchDataHook => {
    const { data, loading, error, refetch } = useQuery(GET_PANELS, {
        fetchPolicy: 'network-only', // Ensures a network request is made
    });

    const fetchData = useCallback(async () => {
        try {
            await refetch(); // Use refetch to fetch data
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
    const createNewPanel = async (input: CreatePanelInput): Promise<void> => {
        try {
            const response = await createPanel({
                variables: { input },
            });

            const result: IPanel = response.data.addPanel;

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          panels: [...(prevData.panels || []), result],
                      }
                    : { panels: [result] }
            );
        } catch (error) {
            console.log('Failed to add new panel:', error);
        }
    };

    const promptAndCreatePanel = async (): Promise<void> => {
        const newPanelLabel = prompt('Enter a new label');
        const newPanelValue = prompt('Enter a new value');
        const newPanelSuffix = prompt('Enter a new suffix');

        if (newPanelLabel && newPanelValue && newPanelSuffix) {
            const input: CreatePanelInput = {
                label: newPanelLabel,
                value: newPanelValue,
                suffix: newPanelSuffix,
            };
            await createNewPanel(input);
        }
    };
    return { createNewPanel: promptAndCreatePanel };
};

export const useUpdatePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): IUpdatePanelHook => {
    const [_updatePanel] = useMutation(UPDATE_PANEL);

    const updatePanel = async (
        id: number,
        data: IPanels | null
    ): Promise<void> => {
        const panelToEdit = data?.panels?.find((panel) => panel.id === id);

        if (!panelToEdit) {
            console.error('Panel not found for editing');
            return;
        }

        const updatePanelLabel =
            prompt('Enter a new label', panelToEdit.label) ?? panelToEdit.label;
        const updatePanelValue =
            prompt('Enter a new value', panelToEdit.value) ?? panelToEdit.value;
        const updatePanelSuffix =
            prompt('Enter a new suffix', panelToEdit.suffix) ??
            panelToEdit.suffix;

        const input: UpdatePanelInput = {
            id: panelToEdit.id,
            label: updatePanelLabel,
            value: updatePanelValue,
            suffix: updatePanelSuffix,
        };

        try {
            const result = await _updatePanel({
                variables: { input },
            });
            const updatedPanel: IPanel = result.data.updatePanel;

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          panels: (prevData.panels || []).map((panel) =>
                              panel.id === id ? { ...panel, ...result } : panel
                          ),
                      }
                    : { panels: [updatedPanel] }
            );
        } catch (error) {
            console.log('Failed to edit panel:', error);
        }
    };

    return { updatePanel };
};

export const useDeletePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): IDeletePanelHook => {
    const [deletePanelMutation] = useMutation(DELETE_PANEL);
    const deletePanel = async (id: number): Promise<void> => {
        const input: DeletePanelInput = {
            id,
        };

        try {
            await deletePanelMutation({
                variables: { input },
            });

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
