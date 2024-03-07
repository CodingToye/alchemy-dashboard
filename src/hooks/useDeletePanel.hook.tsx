import { IPanels, IDeletePanelHook } from '../types/panels.types';

import { useMutation } from '@apollo/client';
import { DELETE_PANEL } from '../graphql/mutations';
import { DeletePanelInput } from '../graphql/types';

const useDeletePanel = (
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

export default useDeletePanel;

// TODO Add client side error handling
