import { useState, useEffect, useCallback } from 'react';

export interface IPanels {
    id: number;
    label: string;
    value: string;
    suffix: string;
}

interface IFetchDataHook {
    data: IPanels[] | null;
    loading: boolean;
    error: Error | null;
    fetchData: () => Promise<void>;
}

interface IAddPanelHook {
    addNewPanel: () => Promise<void>;
}

interface IEditPanelHook {
    editPanel: (id: number, data: IPanels[] | null) => Promise<void>;
}

interface IDeletePanelHook {
    deletePanel: (id: number, data: IPanels[] | null) => Promise<void>;
}

export const useFetchData = (apiEndpoint: string): IFetchDataHook => {
    const [data, setData] = useState<IPanels[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (): Promise<void> => {
        try {
            const response = await fetch(apiEndpoint);
            const result: IPanels[] = await response.json();
            setData(result);
        } catch (error) {
            const typedError = error as Error;
            console.log('Error fetching data:', error);
            setError(typedError);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint, setData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, fetchData };
};

export const useAddPanel = (
    apiEndpoint: string,
    setData: React.Dispatch<React.SetStateAction<IPanels[] | null>>
): IAddPanelHook => {
    const addNewPanel = async (): Promise<void> => {
        const newPanelLabel = prompt('Enter a new label');
        const newPanelValue = prompt('Enter a new value');
        const newPanelSuffix = prompt('Enter a new suffix');

        if (newPanelLabel && newPanelValue && newPanelSuffix) {
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        label: newPanelLabel,
                        value: newPanelValue,
                        suffix: newPanelSuffix,
                    }),
                });

                if (response.ok) {
                    const result: IPanels = await response.json();
                    setData(
                        (prevData) =>
                            (prevData
                                ? [...prevData, result]
                                : [result]) as IPanels[]
                    );
                } else {
                    console.log(
                        'Failed to add new panel:',
                        response.statusText
                    );
                }
            } catch (error) {
                console.log('Failed to add new panel:', error);
            }
        }
    };

    return { addNewPanel };
};

export const useEditPanel = (
    apiEndpoint: string,
    setData: React.Dispatch<React.SetStateAction<IPanels[] | null>>
): IEditPanelHook => {
    const editPanel = async (
        id: number,
        data: IPanels[] | null
    ): Promise<void> => {
        const panelToEdit = data?.find((panel) => panel.id === id);

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
            const response = await fetch(`${apiEndpoint}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    label: editPanelLabel,
                    value: editPanelValue,
                    suffix: editPanelSuffix,
                }),
            });

            if (response.ok) {
                const result: IPanels = await response.json();
                setData((prevData) =>
                    prevData
                        ? prevData.map((panel) =>
                              panel.id === id ? { ...panel, ...result } : panel
                          )
                        : []
                );
            } else {
                console.log('Failed to add new panel:', response.statusText);
            }
        } catch (error) {
            console.log('Failed to add new panel:', error);
        }
    };

    return { editPanel };
};

export const useDeletePanel = (
    apiEndpoint: string,
    setData: React.Dispatch<React.SetStateAction<IPanels[] | null>>
): IDeletePanelHook => {
    const deletePanel = async (
        id: number,
        data: IPanels[] | null
    ): Promise<void> => {
        const panelToDelete = data?.find((panel) => panel.id === id);

        if (!panelToDelete) {
            console.error('Panel not found for editing');
            return;
        }

        try {
            const response = await fetch(`${apiEndpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setData((prevData) =>
                    prevData ? prevData.filter((item) => item.id !== id) : []
                );
            } else {
                console.log('Failed to delete panel:', response.statusText);
            }
        } catch (error) {
            console.log('Failed to delete panel:', error);
        }
    };

    return { deletePanel };
};

export const useResetPanels = (apiEndpoint: string) => {
    const { fetchData } = useFetchData(apiEndpoint);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const resetPanels = useCallback(async () => {
        try {
            setLoading(true);

            const response = await fetch(apiEndpoint, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchData();
            } else {
                console.error('Failed to reset panels:', response.statusText);
                setError(
                    new Error(`Failed to reset panels: ${response.statusText}`)
                );
            }
        } catch (error) {
            const typedError = error as Error;
            console.error('Error resetting panels:', error);
            setError(typedError);
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint, fetchData]);

    return { resetPanels, loading, error };
};
