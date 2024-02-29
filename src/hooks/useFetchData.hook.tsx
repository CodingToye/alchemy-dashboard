import { useState, useEffect, useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { GET_PANELS, GET_TOOLS } from '../graphql/queries';
import { IFetchDataHook } from '../types/panels.types';
import { ITool, ITools } from '../types/tools.types';

export const useToolRefetch = async () => {
    const { refetch: refetchTools } = useQuery(GET_TOOLS, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refetchTools();
            } catch (error) {
                console.error('Error refetching tools:', error);
            }
        };

        fetchData();

        // Optionally return the refetch function if needed
    }, [refetchTools]);

    // Return any additional data or functions needed
    return {
        // Add any additional data or functions here
    };
};

const useFetchData = (): IFetchDataHook => {
    const [dataTools, setDataTools] = useState<ITools | null>(null);
    const {
        data: dataPanels,
        loading: loadingPanels,
        error: errorPanels,
        refetch: refetchPanels,
    } = useQuery(GET_PANELS, {
        fetchPolicy: 'network-only',
    });

    const {
        data: _dataTools,
        loading: loadingTools,
        error: errorTools,
        refetch: refetchTools,
    } = useQuery(GET_TOOLS, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (_dataTools) {
            setDataTools(_dataTools);
        }
    }, [_dataTools]);

    const [installedTools, setInstalledTools] = useState<string[]>([]);

    useEffect(() => {
        if (dataTools && dataTools.tools) {
            setInstalledTools((prevInstalledTools) => {
                const uniqueTools = dataTools.tools.filter(
                    (tool) => !prevInstalledTools.includes(tool.label)
                );
                const installedToolsList = uniqueTools
                    .filter((tool: ITool) => tool.isChecked)
                    .map((tool: ITool) => tool.label);
                return installedToolsList;
            });
        }
    }, [dataTools]);

    const fetchData = useCallback(async () => {
        try {
            await Promise.all([refetchPanels(), refetchTools()]);
        } catch (error) {
            console.error('Error refetching data:', error);
        }
    }, [refetchPanels, refetchTools]);

    useEffect(() => {
        fetchData();
    }, [fetchData, dataPanels, dataTools]);

    return {
        dataPanels,
        dataTools,
        installedTools,
        loading: loadingPanels || loadingTools,
        error: errorPanels || errorTools || null,
        fetchData,
        setDataTools,
    };
};

export default useFetchData;
