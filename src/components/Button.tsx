import React from 'react';

interface ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
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
            className={` p-2 ${
                mode === 'destructive' ? 'bg-red-500' : 'bg-orange'
            } text-white font-bold uppercase text-xs rounded px-6`}
        >
            {children}
        </button>
    );
};

export default Button;
