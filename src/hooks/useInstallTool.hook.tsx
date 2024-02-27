import React, { useState } from 'react';

import { IInstallToolHook, ITools, ITool } from '../types/panels.types';
import { useMutation } from '@apollo/client';
import { INSTALL_TOOL } from '../graphql/mutations';

import Checkbox from '../components/Checkbox';

const useInstallTool = (
    dataTools: ITools | null,
    setDataTools: React.Dispatch<React.SetStateAction<ITools | null>>
): IInstallToolHook => {
    const [installTool] = useMutation(INSTALL_TOOL);
    const [isInstallToolModalOpen, setIsInstallToolModalOpen] = useState(false);

    const openInstallToolModal = () => {
        setIsInstallToolModalOpen(true);
    };

    const closeInstallToolModal = () => {
        setIsInstallToolModalOpen(false);
    };

    const handleInstall = async (toolLabel: string, isChecked: boolean) => {
        try {
            const updatedTools = dataTools?.tools?.map((tool) => {
                if (tool.label === toolLabel) {
                    return { ...tool, installed: isChecked };
                }
                return tool;
            });

            setDataTools({
                ...(dataTools ?? { tools: null }),
                tools: updatedTools as ITool[] | null,
            });

            const updatedInstallStatus = isChecked ? true : false;
            const response = await installTool({
                variables: {
                    label: toolLabel,
                    installed: updatedInstallStatus,
                },
            });

            console.log(response);
        } catch (error) {
            console.log('Failed to install tool:', error);
        }
    };

    const modalInstallToolContent = (
        <>
            {dataTools?.tools?.map((tool) => (
                <Checkbox
                    id={tool.id}
                    key={tool.id}
                    label={tool.label}
                    onChange={(isChecked) =>
                        handleInstall(tool.label, isChecked)
                    }
                    checked={tool.installed}
                />
            ))}
        </>
    );
    return {
        openInstallToolModal,
        closeInstallToolModal,
        isInstallToolModalOpen,
        modalInstallToolContent,
        handleInstall,
    };
};

export default useInstallTool;
