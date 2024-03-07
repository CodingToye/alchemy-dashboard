import { ApolloError } from '@apollo/client';
import { IPanels } from './panels.types';
import { ITools } from './tools.types';
import { IFilters } from './filters.types';

export interface IFetchDataHook {
    dataPanels: IPanels | null;
    dataTools: ITools | null;
    dataFilters: IFilters | null;
    installedTools: string[];
    loading: boolean;
    error: ApolloError | null;
    setDataTools: any;
    fetchData: () => Promise<void>;
}
