import { useState, useCallback } from 'react';

import useFetchData from './useFetchData.hook';
import { useMutation } from '@apollo/client';
import { DELETE_ALL_PANELS } from '../graphql/mutations';

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
