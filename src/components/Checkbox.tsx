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
        <fieldset className='relative' data-testid='checkbox-component-test'>
            <input
                type='checkbox'
                className='focus:ring-offset-0 focus:ring-0 p-2.5 checked:bg-orange cursor-pointer'
                id={id}
                checked={isChecked}
                onChange={handleChange}
                data-testid='checkbox-test'
            />
            <label htmlFor={id} className='ml-2'>
                {label}
            </label>
        </fieldset>
    );
};

export default Checkbox;
