export interface ITool {
    id: string;
    label: string;
    isChecked: boolean;
    installed: boolean;
}

export interface ITools {
    tools: ITool[] | null;
}

export interface IInstallToolHook {
    openInstallToolModal: () => void;
    closeInstallToolModal: () => void;
    handleToolCheckboxChange?: (
        isChecked: React.ChangeEvent<HTMLInputElement>,
        label: string
    ) => void;
    handleInstall: (label: string, isChecked: boolean) => Promise<void>;
    isInstallToolModalOpen: boolean;
    modalInstallToolContent: JSX.Element;
}

export interface IActivateToolHook {
    handleActivateTool: (label: string, isActivated: boolean) => Promise<void>;
    activatedTool: boolean;
}
