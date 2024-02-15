import React, { forwardRef, useState } from 'react';

interface InputProps {
    name: string;
    placeholder?: string;
    onChange: (value: string, name: string) => void;
    value?: string;
    tabIndex?: number;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    { name, placeholder, onChange, value, tabIndex },
    ref
) => {
    const [fieldChanged, setFieldChanged] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: newValue } = e.target;
        setFieldChanged(true);
        onChange(newValue, name);
    };

    return (
        <input
            type='text'
            name={name}
            placeholder={placeholder}
            className={`p-4 ${
                fieldChanged ? 'text-charcoal' : 'text-inputText/10'
            } border border-iron  outline-none focus:shadow-focus focus:text-iron`}
            onChange={handleChange}
            tabIndex={tabIndex}
            value={value !== '' ? value : ''}
            ref={ref}
        />
    );
};

export default forwardRef(Input);
