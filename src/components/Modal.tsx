// Modal.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

import Button from '../components/Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    dismissable: boolean;
    actionButton: {
        label: string;
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
        args?: any[] | undefined;
    };
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    dismissable,
    actionButton,
    children,
}) => {
    const [closeClicked, setCloseClicked] = useState(false);

    const handleOnClose = useCallback(() => {
        setCloseClicked((prevCloseClicked) => !prevCloseClicked);
        setTimeout(() => {
            onClose();
            setCloseClicked(false);
        }, 500);
    }, [onClose]);

    useEffect(() => {
        const handleEscapeKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                console.log('escape key pressed');
                handleOnClose();
            }
        };

        isOpen
            ? document.addEventListener('keydown', handleEscapeKeyPress)
            : document.removeEventListener('keydown', handleEscapeKeyPress);

        return () => {
            document.removeEventListener('keydown', handleEscapeKeyPress);
        };
    }, [isOpen, handleOnClose]);

    const handleOnSave = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        actionButton.onClick(event, ...((actionButton.args as []) || []));
        onClose(); // Close the modal after the action is triggered
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className={`fixed bg-charcoal inset-x-0 mx-auto top-32 z-20 max-w-lg max-h-fit rounded ${
                    closeClicked
                        ? 'animate-fade-out-up'
                        : 'animate-fade-in-down'
                }`}
            >
                <div className='modal-content shadow-xl  '>
                    <header className='flex justify-between items-center pt-4 px-4 text-white rounded-t'>
                        <h2 className='font-display text-2xl'>{title}</h2>
                        <XMarkIcon
                            className='h-6 w-6  cursor-pointer text-inherit hover:text-orange transition'
                            onClick={handleOnClose}
                        />
                    </header>
                    <div className='flex flex-col gap-4 p-4'>
                        {children}

                        <div className='flex flex-row justify-end text-charcoal'>
                            <Button onClick={(event) => handleOnSave(event)}>
                                {actionButton.label}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`bg-iron fixed top-0 left-0 w-screen h-screen z-10 ${
                    closeClicked
                        ? 'animate-backdrop-fade-out'
                        : 'animate-backdrop-fade-in'
                }`}
                onClick={() => (dismissable ? handleOnClose() : '')}
            />
        </>
    );
};

export default Modal;
