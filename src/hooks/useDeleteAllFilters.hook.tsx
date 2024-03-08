import { useState, useCallback } from 'react';

import useFetchData from './useFetchData.hook';
import { useMutation } from '@apollo/client';
import { DELETE_ALL_FILTERS } from '../graphql/mutations';

const useDeleteAllFilters = () => {
    const { fetchData } = useFetchData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [deleteAllFiltersMutation] = useMutation(DELETE_ALL_FILTERS);

    const deleteAllFilters = useCallback(async () => {
        try {
            setLoading(true);
            await deleteAllFiltersMutation();
            await fetchData();
        } catch (error) {
            const typedError = error as Error;
            console.error('Error resetting filters:', error);
            setError(typedError);
        } finally {
            setLoading(false);
        }
    }, [fetchData, deleteAllFiltersMutation]);

    return { deleteAllFilters, loading, error };
};

export default useDeleteAllFilters;
