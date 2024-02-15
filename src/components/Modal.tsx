// Modal.tsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { CheckIcon } from '@heroicons/react/24/solid';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    actionButton: {
        label: string;
        onClick: () => void;
        args?: any[] | undefined;
    };
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    actionButton,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div className='fixed bg-bad shadow inset-x-0 mx-auto top-32 z-20 max-w-lg max-h-fit rounded'>
                <div className='modal-content'>
                    <header className='flex justify-between items-center mb-4 p-4 bg-white text-charcoal rounded-t'>
                        <h2 className='font-display text-2xl'>{title}</h2>
                        <XMarkIcon
                            className='h-6 w-6  cursor-pointer'
                            onClick={onClose}
                        />
                    </header>
                    <div className='flex flex-col gap-4 p-4'>
                        {children}

                        <div className='flex flex-row justify-end text-charcoal'>
                            <CheckIcon
                                className='h-6 w-6 cursor-pointer'
                                title={actionButton.label}
                                onClick={() =>
                                    actionButton.onClick(
                                        ...((actionButton.args as []) || [])
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-charcoal fixed top-0 left-0 w-screen h-screen z-10 opacity-80'></div>
        </>
    );
};

export default Modal;
