import { ApolloError } from '@apollo/client';

export interface IPanel {
    id: number;
    label: string;
    value: string;
    suffix: string;
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
    createNewPanel: (data: IPanels | null) => Promise<void>;
}

export interface IUpdatePanelHook {
    updatePanel: (id: number, data: IPanels | null) => Promise<void>;
}

export interface IDeletePanelHook {
    deletePanel: (id: number, data: IPanels | null) => Promise<void>;
}
