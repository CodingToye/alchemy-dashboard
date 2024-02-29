import React, { useState } from 'react';

interface CheckboxProps {
    id: string;
    label?: string;
    onChange?: (isChecked: boolean) => void;
    checked?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
    id,
    label,
    onChange,
    checked = false,
}) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckedState = e.target.checked;
        setIsChecked(newCheckedState);
        if (onChange) {
            onChange(newCheckedState);
        }
    };

    return (
        <fieldset className='relative'>
            <input
                type='checkbox'
                id={id}
                checked={isChecked}
                onChange={handleChange}
            />
            <label htmlFor={id} className='ml-2'>
                {label}
            </label>
        </fieldset>
    );
};

export default Checkbox;
