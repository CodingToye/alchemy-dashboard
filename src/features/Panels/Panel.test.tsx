import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Panel from './Panel';

// mock the custom hooks
jest.mock('../../hooks/useFetchData.hook', () => ({
    __esModule: true,
    default: () => ({
        dataPanels: [],
        fetchData: jest.fn(),
    }),
}));
jest.mock('../../hooks/useUpdatePanel.hook.tsx', () => ({
    __esModule: true,
    default: () => ({
        openUpdateModal: jest.fn(),
        closeUpdateModal: jest.fn(),
        isUpdateModalOpen: false,
        updatedPanelData: {},
        modalUpdateContet: <div>Modal Content</div>,
        handleUpdatePanel: jest.fn(),
    }),
}));
jest.mock('../../hooks/useDeletePanel.hook.tsx', () => ({
    __esModule: true,
    default: () => ({
        deletePanel: jest.fn(),
    }),
}));

describe('Panel Integration Test', () => {
    test('renders panel with provided data and interacts with modal', async () => {
        // render the Panel component
        render(
            <Panel
                panel={{
                    id: '1',
                    label: 'Test Panel',
                    target: '100',
                    value: '50',
                    original: '0',
                    unit: '%',
                }}
            />
        );

        const valueElement = screen.getByTestId('panel-value-test');
        const targetElement = screen.getByTestId('panel-target-test');

        // assertions
        expect(screen.getByText('Test Panel')).toBeInTheDocument();
        expect(valueElement).toHaveTextContent('50');
        expect(targetElement).toHaveTextContent('100');

        // const editBtn = screen.getByTitle('Edit');

        // screen.debug(editBtn);
        // // Simulate clicking the edit button
        // fireEvent.click(screen.getByTitle('Edit'));
        // await new Promise((resolve) => setTimeout(resolve, 1000));

        // const updateModal = screen.getByTitle('Update Panel');

        // screen.debug(updateModal);

        // const fizz = screen.getByTestId('modal-comp-test');

        // screen.debug(fizz);

        // const modalTitleElement = screen.getByTestId('panel-modal-title');

        // await waitFor(() => {
        //     expect(modalTitleElement).toHaveTextContent('Update Panel');
        // });

        // const fizz = screen.getByTitle('Update Panel');

        // screen.debug(fizz);

        // Assert that the modal opens
        // await waitFor(() => {
        //     expect(screen.getByTitle('Update Panel')).toBeInTheDocument();
        // });
        // expect(screen.getByText('Modal Content')).toBeInTheDocument();

        // // Simulate clicking the delete button
        // fireEvent.click(screen.getByTitle('Delete'));

        // // Assert that the delete function is called
        // expect(deletePanel).toHaveBeenCalledWith('1', []);
    });
});
