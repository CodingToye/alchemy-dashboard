import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
    const handleOnClose = jest.fn();
    const handleOnClick = jest.fn();
    const modalIsOpen = true;
    const modalTitle = 'Modal title';
    const modalDismissable = true;
    const modalActionButtonLabel = 'Action Button label';

    const renderModal = () => {
        return render(
            <Modal
                isOpen={modalIsOpen}
                title={modalTitle}
                onClose={handleOnClose}
                dismissable={modalDismissable}
                actionButton={{
                    label: modalActionButtonLabel,
                    onClick: handleOnClick,
                    args: [],
                }}
            >
                Modal Content
            </Modal>
        );
    };

    test('renders with provided props', () => {
        renderModal();
        const modalComp = screen.getByTestId('modal-comp-test');
        expect(modalComp).toBeInTheDocument();
    });

    test('closes modal when close button is clicked', async () => {
        renderModal();
        const modalCloseButton = screen.getByTestId('modal-close-button');
        expect(modalCloseButton).toBeInTheDocument();
        fireEvent.click(modalCloseButton);
        await waitFor(() => {
            expect(handleOnClose).toHaveBeenCalled();
        });
    });

    test('closes the modal when backdrop is clicked and dismissable is true', async () => {
        renderModal();
        const backdrop = screen.getByTestId('modal-backdrop-test');
        fireEvent.click(backdrop);
        await waitFor(() => {
            expect(handleOnClose).toHaveBeenCalled();
        });
    });

    test('triggers action button onClick and closes modal when action button is clicked', async () => {
        renderModal();
        const modalActionButton = screen.getByRole('button', {
            name: /action button label/i,
        });

        fireEvent.click(modalActionButton);
        await waitFor(() => {
            expect(handleOnClick).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(handleOnClose).toHaveBeenCalled();
        });
    });

    test('closes modal when Escape key is pressed', async () => {
        renderModal();
        fireEvent.keyDown(document, { key: 'Escape' });
        await waitFor(() => {
            expect(handleOnClose).toHaveBeenCalled();
        });
    });

    test('renders modal content correctly', () => {
        renderModal();
        const modalContent = screen.getByText(/modal content/i);
        expect(modalContent).toBeInTheDocument();
    });
});
