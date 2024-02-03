import React, { useEffect } from 'react';

import {
    useFetchData,
    useAddPanel,
    useEditPanel,
    useDeletePanel,
    useResetPanels,
} from '../hooks/panels.hooks';

const Panels: React.FC = () => {
    const { data, loading, error, fetchData } = useFetchData();

    const { addNewPanel } = useAddPanel(fetchData);
    const { editPanel } = useEditPanel(fetchData);
    const { deletePanel } = useDeletePanel(fetchData);
    const { resetPanels } = useResetPanels();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddNewPanel = async () => {
        addNewPanel(data);
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
                    {data &&
                    data.panels &&
                    Array.isArray(data.panels) &&
                    data.panels.length > 0 ? (
                        data.panels.map((x, i) => (
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
                        ))
                    ) : (
                        <p>No data available.</p>
                    )}
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
