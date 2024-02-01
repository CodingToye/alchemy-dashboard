import React, { useState, useEffect } from 'react';

interface IPanels {
    id: number;
    label: string;
    value: string;
    suffix: string;
}

const Panels: React.FC = () => {
    const [data, setData] = useState<IPanels[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const apiEndpoint = 'http://localhost:5000/api/data';

    const fetchData = async (url: string) => {
        try {
            const response = await fetch(url);
            const result: IPanels[] = await response.json();
            return result;
        } catch (error) {
            console.log('Error fetching data:', error);
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(apiEndpoint)
            .then((result) => setData(result))
            .catch((error) => {
                console.log('Initial data fetch failed:', error);
                setError(error);
            });
    }, []);

    const handleEditPanel = (id: number) => {
        const newVal = prompt('Enter a new value');
        if (newVal === null || newVal.trim() === '') {
            return;
        }
        setData(
            (prevData) =>
                prevData?.map((panel) =>
                    panel.id === id ? { ...panel, value: newVal } : panel
                ) ?? []
        );
    };

    const handleDeletePanel = (x: number) => {
        setData((prevData) =>
            prevData ? prevData.filter((item) => item.id !== x) : []
        );
    };

    const handleAddNewPanel = (x: number) => {
        const newPanelLabel = prompt('Enter a new label');
        const newPanelValue = prompt('Enter a new value');
        const newPanelSuffix = prompt('Enter a new suffix');
        const newPanel = {
            id: x,
            label: newPanelLabel !== null ? newPanelLabel : '',
            value: newPanelValue !== null ? newPanelValue : '',
            suffix: newPanelSuffix !== null ? newPanelSuffix : '',
        };
        setData((prevData) => (prevData ? [...prevData, newPanel] : []));
    };

    const handleResetPanels = async () => {
        try {
            const originalData = await fetchData(apiEndpoint);
            setData(originalData);
        } catch (error) {
            console.log('Failed to reset panels:', error);
        }
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
            <button type='button' onClick={() => handleAddNewPanel(5)}>
                Add a new panel
            </button>
            <button type='button' onClick={() => handleResetPanels()}>
                Reset panels
            </button>
        </>
    );
};

export default Panels;
