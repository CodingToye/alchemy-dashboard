import { useState } from 'react';

interface IPanels {
    id: number;
    label: string;
    value: string;
    suffix: string;
}

const Panels = () => {
    const [data, setData] = useState<IPanels[]>([
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
    ]);

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

    const handleAddNewPanel = () => {
        console.log('add new');
    };

    const handleResetPanels = () => {
        console.log('reset');
    };

    const handleDeletePanel = (x: number) => {
        console.log('delete', x);
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
            <button type='button' onClick={() => handleAddNewPanel()}>
                Add new panel
            </button>
            <button type='button' onClick={() => handleResetPanels()}>
                Reset panels
            </button>
        </>
    );
};

export default Panels;
