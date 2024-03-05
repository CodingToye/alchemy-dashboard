import { IFilters, IDeleteFilterHook } from '../types/filters.types';

import { useMutation } from '@apollo/client';
import { DELETE_FILTER } from '../graphql/mutations';
import { DeleteFilterInput } from '../graphql/types';

const useDeleteFilter = (
    setData: React.Dispatch<React.SetStateAction<IFilters | null>>
): IDeleteFilterHook => {
    const [deleteFilterMutation] = useMutation(DELETE_FILTER);
    const deleteFilter = async (id: string): Promise<void> => {
        const input: DeleteFilterInput = { id };

        try {
            await deleteFilterMutation({ variables: input });

            setData((prevData) =>
                prevData
                    ? {
                          ...prevData,
                          filters: (prevData.filters || []).filter(
                              (tag) => tag.id !== id
                          ),
                      }
                    : null
            );
        } catch (error) {
            console.log('Failed to delete tag:', error);
        }
    };

    return { deleteFilter };
};

export default useDeleteFilter;
