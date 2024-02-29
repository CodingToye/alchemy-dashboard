import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
    const handleChange = jest.fn();
    const inputName = 'My input';
    const inputPlaceholder = 'My input placeholder';
    const inputValue = '';
    const inputTabIndex = 1;

    const renderInput = (inputShowLabel: true | false) => {
        return render(
            <Input
                name={inputName}
                onChange={handleChange}
                placeholder={inputPlaceholder}
                value={inputValue}
                tabIndex={inputTabIndex}
                showLabel={inputShowLabel}
            />
        );
    };

    test('renders with provided props', () => {
        renderInput(true);
        const inputComp = screen.getByTestId('input-component-test');
        expect(inputComp).toBeInTheDocument();
    });

    test('renders without the label element', () => {
        renderInput(false);
        const inputComp = screen.getByTestId('input-component-test');
        expect(inputComp).toBeInTheDocument();
    });

    test('calls onChange with new value', () => {
        renderInput(false);
        const input = screen.getByTestId('input-test');

        fireEvent.change(input, { target: { value: 'test' } });
        expect(handleChange).toHaveBeenCalledWith('test', inputName);
    });
});
