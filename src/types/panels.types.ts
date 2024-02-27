import { ApolloError } from '@apollo/client';

export interface IPanel {
    id: string;
    label: string;
    target: string;
    value: string;
    original: string;
    unit: string;
}

export interface IPanels {
    panels: IPanel[] | null;
}

export interface ITool {
    id: string;
    label: string;
    isChecked: boolean;
    installed: boolean;
}

export interface ITools {
    tools: ITool[] | null;
}

export interface IFetchDataHook {
    dataPanels: IPanels | null;
    dataTools: ITools | null;
    installedTools: string[];
    loading: boolean;
    error: ApolloError | null;
    setDataTools: any;
    fetchData: () => Promise<void>;
}

export interface ICreatePanelHook {
    openCreatePanelModal: () => void;
    closeCreatePanelModal: () => void;
    handleInputChange: (value: string, name: string) => void;
    handleCreatePanel: () => Promise<void>;
    isCreatePanelModalOpen: boolean;
    modalCreatePanelContent: JSX.Element;
}

export interface IInstallToolHook {
    openInstallToolModal: () => void;
    closeInstallToolModal: () => void;
    handleToolCheckboxChange?: (
        isChecked: React.ChangeEvent<HTMLInputElement>,
        label: string
    ) => void;
    handleInstall: (label: string, installed: boolean) => Promise<void>;
    isInstallToolModalOpen: boolean;
    modalInstallToolContent: JSX.Element;
}

export interface IUpdatePanelHook {
    openUpdateModal: (
        id: string,
        label: string,
        target: string,
        value: string,
        original: string,
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
