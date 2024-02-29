import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
    const handleChange = jest.fn();
    const checkboxLabel = 'Check me';

    const renderCheckbox = (checkedState: true | false) => {
        return render(
            <Checkbox
                id='1'
                onChange={handleChange}
                label={checkboxLabel}
                checked={checkedState}
            />
        );
    };

    test('renders checkbox with props - checked state true', () => {
        renderCheckbox(true);
        const checkboxComp = screen.getByTestId('checkbox-component-test');
        expect(checkboxComp).toBeInTheDocument();
    });

    test('renders checkbox with props - checked state false', () => {
        renderCheckbox(false);
        const checkboxComp = screen.getByTestId('checkbox-component-test');
        expect(checkboxComp).toBeInTheDocument();
    });

    test('calls onChange with true when checked', () => {
        renderCheckbox(false);
        const checkbox = screen.getByTestId('checkbox-test');
        fireEvent.click(checkbox);

        expect(handleChange).toHaveBeenCalledWith(true);
    });

    test('calls onChange with false when checked', () => {
        renderCheckbox(true);
        const checkbox = screen.getByTestId('checkbox-test');
        fireEvent.click(checkbox);

        expect(handleChange).toHaveBeenCalledWith(false);
    });
});
