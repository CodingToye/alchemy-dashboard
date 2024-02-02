import React, { useEffect } from 'react';
import {
    useFetchData,
    useAddPanel,
    useEditPanel,
    useDeletePanel,
    useResetPanels,
} from '../hooks/panels.hooks';

const Panels: React.FC = () => {
    const apiEndpoint = 'http://localhost:5000/api/data';
    const { data, loading, error, fetchData } = useFetchData(apiEndpoint);

    const { addNewPanel } = useAddPanel(apiEndpoint, fetchData);
    const { editPanel } = useEditPanel(apiEndpoint, fetchData);
    const { deletePanel } = useDeletePanel(apiEndpoint, fetchData);
    const { resetPanels } = useResetPanels(apiEndpoint);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddNewPanel = async () => {
        addNewPanel();
    };

    const handleEditPanel = async (id: number) => {
        await editPanel(id, data);
    };

    const handleDeletePanel = async (id: number) => {
        await deletePanel(id, data);
    };

    const handleResetPanels = async () => {
        await resetPanels();
        await fetchData();
    };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='panels'>
                    {data?.map((x, i) => {
                        return (
                            <div className='panels__panel' key={i}>
                                <h2>{x.label}</h2>
                                <span>
                                    {x.value}
                                    <small className='suffix'>{x.suffix}</small>
                                </span>
                                <div className='panels__panel__actions'>
                                    <button
                                        type='button'
                                        onClick={() => handleEditPanel(x.id)}
                                    >
                                        Edit Panel
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => handleDeletePanel(x.id)}
                                    >
                                        Delete Panel
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {error && (
                        <div style={{ color: 'red', margin: '10px' }}>
                            Error: {error.message}
                        </div>
                    )}
                </div>
            )}
            <button type='button' onClick={handleAddNewPanel}>
                Add a new panel
            </button>
            <button type='button' onClick={handleResetPanels}>
                Reset panels
            </button>
        </>
    );
};

export default Panels;
