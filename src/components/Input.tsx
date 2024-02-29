import React, { forwardRef, useState } from 'react';

interface InputProps {
    name: string;
    placeholder?: string;
    onChange: (value: string, name: string) => void;
    value?: string;
    tabIndex?: number;
    showLabel?: boolean;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    { name, placeholder, onChange, value, tabIndex, showLabel },
    ref
) => {
    const [fieldChanged, setFieldChanged] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: newValue } = e.target;
        setFieldChanged(true);
        onChange(newValue, name);
    };

    return (
        <fieldset className='relative'>
            {showLabel && (
                <label
                    htmlFor={name}
                    className='absolute left-3 top-1.5 capitalize text-xs font-bold text-charcoal/75'
                >
                    {name}
                </label>
            )}
            <input
                type='text'
                id={name}
                name={name}
                placeholder={placeholder}
                className={`px-3 ${
                    showLabel && 'pt-6'
                } py-3 w-full rounded-md  border-0  focus:border-1 focus:border-iron/25 focus:ring-0 bg-white focus:bg-white/90 transition-colors duration-300 ${
                    fieldChanged ? 'text-charcoal' : 'text-inputText/60'
                } placeholder-iron/50 focus:placeholder-iron/20`}
                onChange={handleChange}
                tabIndex={tabIndex}
                value={value !== '' ? value : ''}
                ref={ref}
            />
        </fieldset>
    );
};

export default forwardRef(Input);
