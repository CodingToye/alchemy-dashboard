import { useState } from 'react';

interface IPanels {
    id: number;
    label: string;
    value: string;
    suffix: string;
}

const Panels = () => {
    const originalData: IPanels[] = [
        {
            id: 1,
            label: 'Room Temperature',
            value: '36',
            suffix: 'f',
        },
        {
            id: 2,
            label: 'Electricity Usage',
            value: '2700',
            suffix: 'kWh',
        },
        {
            id: 3,
            label: 'Water Usage',
            value: '156',
            suffix: 'm3',
        },
        {
            id: 4,
            label: 'Gas Usage',
            value: '11500',
            suffix: 'kWh',
        },
    ];

    const [data, setData] = useState<IPanels[]>(originalData);

    const handleEditPanel = (id: number) => {
        const newVal = prompt('Enter a new value');
        if (newVal === null || newVal.trim() === '') {
            return;
        }
        setData((prevData) =>
            prevData.map((panel) =>
                panel.id === id ? { ...panel, value: newVal } : panel
            )
        );
    };

    const handleDeletePanel = (x: number) => {
        setData((prevData) => prevData.filter((item) => item.id !== x));
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
        setData((prevData) => [...prevData, newPanel]);
    };

    const handleResetPanels = () => {
        console.log(data);
        setData([...originalData]);
    };

    return (
        <>
            <div className='panels'>
                {data.map((x, i) => {
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
                                    Edit
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleDeletePanel(x.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button type='button' onClick={() => handleAddNewPanel(5)}>
                Add new panel
            </button>
            <button type='button' onClick={() => handleResetPanels()}>
                Reset panels
            </button>
        </>
    );
};

export default Panels;
