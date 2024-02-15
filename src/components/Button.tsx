import React from 'react';

interface ButtonProps {
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    mode?: 'default' | 'destructive';
    title?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    onClick,
    mode = 'default',
    title,
}) => {
    return (
        <button
            type='button'
            title={title}
            onClick={onClick}
            className={`mr-3 p-2 ${
                mode === 'destructive' ? 'bg-red-500' : 'bg-white'
            } text-charcoal text-xs`}
        >
            {children}
        </button>
    );
};

export default Button;
