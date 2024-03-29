import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    mode?: 'default' | 'destructive';
    title?: string;
    buttonType?: 'submit' | 'reset' | 'button';
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    mode = 'default',
    title,
    buttonType = 'button',
}) => {
    const btnClasses = classNames('rounded py-2 px-4 text-white', {
        'bg-orange': mode === 'default',
        'bg-failure': mode === 'destructive',
    });
    return (
        <button
            className={btnClasses}
            type={buttonType}
            title={title}
            onClick={onClick}
            data-testid='button-test'
        >
            {children}
        </button>
    );
};

export default Button;
