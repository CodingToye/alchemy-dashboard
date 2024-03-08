import React, { useState } from 'react';
import { Path, UseFormRegister, FieldValues } from 'react-hook-form';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface InputProps<T extends FieldValues> {
    inputLabel: Path<T>;
    placeholder?: string;
    onChange: (value: string, name: string) => void;
    value?: string;
    tabIndex?: number;
    showLabel?: boolean;
    register: UseFormRegister<T>;
    required?: boolean;
    errors: Record<string, any>;
    validationSchema?: {};
}

const Input: React.ForwardRefRenderFunction<
    HTMLInputElement,
    InputProps<any>
> = ({
    inputLabel,
    placeholder,
    onChange,
    value,
    tabIndex,
    showLabel,
    register,
    required,
    errors,
    validationSchema,
}) => {
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
            <span className='absolute right-3 text-lg text-failure'>
                {required ? '*' : ''}
            </span>
            <input
                {...register(inputLabel, validationSchema)}
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
                data-testid='input-test'
            />

            {errors && errors[inputLabel]?.type === 'required' && (
                <span className='text-failure p-2 flex items-center'>
                    <ExclamationTriangleIcon className='w-4 h-4 mr-2' />{' '}
                    {errors[inputLabel]?.message}
                </span>
            )}

            {errors && errors[inputLabel]?.type === 'maxLength' && (
                <span className='text-failure p-2 flex items-center'>
                    <ExclamationTriangleIcon className='w-4 h-4 mr-2' />{' '}
                    {errors[inputLabel]?.message}
                </span>
            )}
        </fieldset>
    );
};

export default Input;
