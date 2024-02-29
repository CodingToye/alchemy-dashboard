import React from 'react';

interface ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
    mode?: 'default' | 'destructive';
    title?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    mode = 'default',
    title,
}) => {
    return (
        <button
            type='button'
            title={title}
            onClick={onClick}
            className={` p-2 ${
                mode === 'destructive' ? 'bg-failure' : 'bg-orange'
            } text-white font-bold uppercase text-xs rounded px-6`}
            data-testid='button-test'
        >
            {children}
        </button>
    );
};

export default Button;
