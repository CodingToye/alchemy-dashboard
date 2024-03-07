// Modal.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    dismissable: boolean;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    dismissable,
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

    if (!isOpen) return null;

    return (
        <>
            <div
                data-testid='modal-comp-test'
                className={`fixed bg-charcoal inset-x-0 mx-auto top-32 z-20 max-w-lg max-h-fit rounded ${
                    closeClicked
                        ? 'animate-fade-out-up'
                        : 'animate-fade-in-down'
                }`}
            >
                <div className='modal-content shadow-xl  '>
                    <header className='flex justify-between items-center pt-4 px-4 text-white rounded-t'>
                        <h2
                            className='font-display text-2xl'
                            data-testid='panel-modal-title'
                        >
                            {title}
                        </h2>
                        <XMarkIcon
                            className='h-6 w-6  cursor-pointer text-inherit hover:text-orange transition'
                            onClick={handleOnClose}
                            data-testid='modal-close-button'
                        />
                    </header>
                    <div className='p-4'>{children}</div>
                </div>
            </div>
            <div
                className={`bg-iron fixed top-0 left-0 w-screen h-screen z-10 ${
                    closeClicked
                        ? 'animate-backdrop-fade-out'
                        : 'animate-backdrop-fade-in'
                }`}
                onClick={() => (dismissable ? handleOnClose() : '')}
                data-testid='modal-backdrop-test'
            />
        </>
    );
};

export default Modal;
