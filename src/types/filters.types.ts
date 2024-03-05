export interface IFilter {
    id: string;
    tag: string;
    activated: boolean;
}

export interface IFilters {
    filters: IFilter[] | null;
}

export interface ICreateFilterHook {
    openCreateFilterModal: () => void;
    closeCreateFilterModal: () => void;
    handleInputChange: (value: string, name: string) => void;
    handleCreateFilter: () => Promise<void>;
    isCreateFilterModalOpen: boolean;
    modalCreateFilterContent: JSX.Element;
}

export interface IDeleteFilterHook {
    deleteFilter: (id: string) => Promise<void>;
}
