import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    extraClasses?: string;
    children: React.ReactNode;
    activated: boolean;
}

const Tag: React.FC<ButtonProps> = ({
    children,
    extraClasses,
    onClick,
    activated,
}) => {
    const tagClasses = classNames(
        `flex items-center rounded py-2 px-4 pr-3 text-xs transition ${extraClasses} ${
            activated
                ? 'bg-orange/80 hover:bg-orange text-white'
                : 'bg-iron/80 hover:bg-iron text-white/50'
        }`,
        {}
    );
    return (
        <button
            className={tagClasses}
            type='button'
            onClick={onClick}
            data-testid='tag-test'
        >
            {children}
        </button>
    );
};

export default Tag;
