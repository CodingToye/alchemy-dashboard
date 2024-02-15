import { ApolloError } from '@apollo/client';

export interface IPanel {
    id: string;
    label: string;
    value: string;
    unit: string;
}

export interface IPanels {
    panels: IPanel[] | null;
}

export interface IFetchDataHook {
    data: IPanels | null;
    loading: boolean;
    error: ApolloError | null;
    fetchData: () => Promise<void>;
}

export interface ICreatePanelHook {
    openModal: () => void;
    closeModal: () => void;
    handleInputChange: (value: string, name: string) => void;
    handleCreatePanel: () => Promise<void>;
    isModalOpen: boolean;
    modalContent: JSX.Element;
}

export interface IUpdatePanelHook {
    openUpdateModal: (
        id: string,
        label: string,
        value: string,
        unit: string
    ) => void;
    closeUpdateModal: () => void;
    handleInputChange: (value: string, name: string) => void;
    handleUpdatePanel: (id: string, data: IPanels | null) => Promise<void>;
    isUpdateModalOpen: boolean;
    modalUpdateContent: JSX.Element;
    updatedPanelData: any;
}

export interface IDeletePanelHook {
    deletePanel: (id: string, data: IPanels | null) => Promise<void>;
}
