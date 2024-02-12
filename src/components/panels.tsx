import React, { useEffect } from 'react';

import {
    useFetchData,
    useCreatePanel,
    useUpdatePanel,
    useDeletePanel,
    useDeleteAllPanels,
} from '../hooks/panels.hooks';

const Panels: React.FC = () => {
    const { data, loading, error, fetchData } = useFetchData();

    const { createNewPanel } = useCreatePanel(fetchData);
    const { updatePanel } = useUpdatePanel(fetchData);
    const { deletePanel } = useDeletePanel(fetchData);
    const { deleteAllPanels } = useDeleteAllPanels();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateNewPanel = async () => {
        createNewPanel(data);
    };

    const handleUpdatePanel = async (id: number) => {
        await updatePanel(id, data);
    };

    const handleDeletePanel = async (id: number) => {
        await deletePanel(id, data);
    };

    const handleDeleteAllPanels = async () => {
        await deleteAllPanels();
        await fetchData();
    };

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='panels grid grid-cols-2 gap-3'>
                    {data &&
                    data.panels &&
                    Array.isArray(data.panels) &&
                    data.panels.length > 0 ? (
                        data.panels.map((x, i) => (
                            <div
                                className='panels__panel relative p-3 bg-charcoal hover:bg-lilac'
                                key={i}
                            >
                                <h2 className='mb-3'>{x.label}</h2>
                                <span className='text-5xl'>
                                    {x.value}
                                    <small className='suffix'>{x.suffix}</small>
                                </span>
                                <div className='panels__panel__actions absolute top-3 right-0'>
                                    <button
                                        type='button'
                                        className='mr-3 p-2 bg-white text-charcoal text-xs'
                                        onClick={() => handleUpdatePanel(x.id)}
                                    >
                                        Edit Panel
                                    </button>
                                    <button
                                        className='mr-3 p-2 bg-red-500 text-charcoal text-xs'
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
            <button type='button' onClick={handleCreateNewPanel}>
                Add a new panel
            </button>
            <button type='button' onClick={handleDeleteAllPanels}>
                Reset panels
            </button>
        </>
    );
};

export default Panels;
