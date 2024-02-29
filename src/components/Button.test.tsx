import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
    const handleClick = jest.fn();
    const buttonText = 'Click me';
    const buttonTitle = 'Submit';

    const renderButton = (
        buttonMode: 'default' | 'destructive' | undefined
    ) => {
        return render(
            <Button onClick={handleClick} title={buttonTitle} mode={buttonMode}>
                {buttonText}
            </Button>
        );
    };

    test('renders with provided props', () => {
        renderButton('default');
        const button = screen.getByTestId('button-test');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(buttonText);
        expect(button).toHaveAttribute('title', buttonTitle);
        expect(button).toHaveClass('bg-orange');
    });
    test('renders button in destructive mode', () => {
        renderButton('destructive');
        const button = screen.getByTestId('button-test');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-failure');
    });
    test('renders default button if no mode has been selected', () => {
        renderButton(undefined);
        const button = screen.getByTestId('button-test');
        expect(button).toBeInTheDocument();
    });
});
