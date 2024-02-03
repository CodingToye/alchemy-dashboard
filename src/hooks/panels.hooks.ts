import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, ApolloError } from '@apollo/client';
import gql from 'graphql-tag';

export interface IPanel {
    id: number;
    label: string;
    value: string;
    suffix: string;
}

export interface IPanels {
    panels: IPanel[] | null;
}

const GET_PANELS = gql`
    query {
        panels {
            id
            label
            value
            suffix
        }
    }
`;

const ADD_PANEL = gql`
    mutation addPanel($label: String!, $value: String!, $suffix: String!) {
        addPanel(label: $label, value: $value, suffix: $suffix) {
            label
            value
            suffix
        }
    }
`;

const UPDATE_PANEL = gql`
    mutation UpdatePanel(
        $id: String!
        $label: String
        $value: String
        $suffix: String
    ) {
        updatePanel(id: $id, label: $label, value: $value, suffix: $suffix) {
            id
            label
            value
            suffix
        }
    }
`;

const DELETE_PANEL = gql`
    mutation DeletePanel($id: String!) {
        deletePanel(id: $id) {
            id
        }
    }
`;

const DELETE_ALL_PANELS = gql`
    mutation {
        deleteAllPanels {
            id
        }
    }
`;

interface IFetchDataHook {
    data: IPanels | null;
    loading: boolean;
    error: ApolloError | null;
    fetchData: () => Promise<void>;
}

interface IAddPanelHook {
    addNewPanel: (data: IPanels | null) => Promise<void>;
}

interface IEditPanelHook {
    editPanel: (id: number, data: IPanels | null) => Promise<void>;
}

interface IDeletePanelHook {
    deletePanel: (id: number, data: IPanels | null) => Promise<void>;
}

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

export const useAddPanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): IAddPanelHook => {
    const [addPanel] = useMutation(ADD_PANEL);
    const addNewPanel = async (): Promise<void> => {
        const newPanelLabel = prompt('Enter a new label');
        const newPanelValue = prompt('Enter a new value');
        const newPanelSuffix = prompt('Enter a new suffix');

        if (newPanelLabel && newPanelValue && newPanelSuffix) {
            try {
                const response = await addPanel({
                    variables: {
                        label: newPanelLabel,
                        value: newPanelValue,
                        suffix: newPanelSuffix,
                    },
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
        }
    };

    return { addNewPanel };
};

export const useEditPanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): IEditPanelHook => {
    const [updatePanel] = useMutation(UPDATE_PANEL);

    const editPanel = async (
        id: number,
        data: IPanels | null
    ): Promise<void> => {
        const panelToEdit = data?.panels?.find((panel) => panel.id === id);

        if (!panelToEdit) {
            console.error('Panel not found for editing');
            return;
        }

        const editPanelLabel =
            prompt('Enter a new label', panelToEdit.label) ?? panelToEdit.label;
        const editPanelValue =
            prompt('Enter a new value', panelToEdit.value) ?? panelToEdit.value;
        const editPanelSuffix =
            prompt('Enter a new suffix', panelToEdit.suffix) ??
            panelToEdit.suffix;

        try {
            const result = await updatePanel({
                variables: {
                    id: id.toString(),
                    label: editPanelLabel,
                    value: editPanelValue,
                    suffix: editPanelSuffix,
                },
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

    return { editPanel };
};

export const useDeletePanel = (
    setData: React.Dispatch<React.SetStateAction<IPanels | null>>
): IDeletePanelHook => {
    const [deletePanelMutation] = useMutation(DELETE_PANEL);
    const deletePanel = async (
        id: number,
        data: IPanels | null
    ): Promise<void> => {
        const panelToDelete = data?.panels?.find((panel) => panel.id === id);

        if (!panelToDelete) {
            console.error('Panel not found for editing');
            return;
        }

        try {
            await deletePanelMutation({
                variables: {
                    id: id.toString(),
                },
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

export const useResetPanels = () => {
    const { fetchData } = useFetchData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [deleteAllPanelsMutation] = useMutation(DELETE_ALL_PANELS);

    const resetPanels = useCallback(async () => {
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

    return { resetPanels, loading, error };
};
