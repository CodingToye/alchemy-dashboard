import React, { forwardRef, useState } from 'react';
import { Path, UseFormRegister } from 'react-hook-form';

export interface IFormValues {
    inputLabel: string;
    target: string;
    value: string;
    original: string;
    unit: string;
    tag: string;
}
interface InputProps {
    inputLabel: Path<IFormValues>;
    placeholder?: string;
    onChange: (value: string, name: string) => void;
    value?: string;
    tabIndex?: number;
    showLabel?: boolean;
    register: UseFormRegister<IFormValues>;
    required?: boolean;
    singleErrorInput: string;
}

const Input: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    {
        inputLabel,
        placeholder,
        onChange,
        value,
        tabIndex,
        showLabel,
        register,
        required,
    },
    ref
) => {
    const [fieldChanged, setFieldChanged] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: newValue } = e.target;
        setFieldChanged(true);
        onChange(newValue, inputLabel);
    };

    return (
        <fieldset className='relative' data-testid='input-component-test'>
            {showLabel && (
                <label
                    htmlFor={inputLabel}
                    className='absolute left-3 top-1.5 capitalize text-xs font-bold text-charcoal/75'
                >
                    {inputLabel}
                </label>
            )}
            <input
                {...register(inputLabel, { required })}
                type='text'
                id={inputLabel}
                name={inputLabel}
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
                data-testid='input-test'
            />
        </fieldset>
    );
};

export default forwardRef(Input);

// TODO Add validation
