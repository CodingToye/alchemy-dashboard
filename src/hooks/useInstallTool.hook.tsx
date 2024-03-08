import React, { useState } from 'react';

import { IInstallToolHook, ITools, ITool } from '../types/tools.types';
import { useMutation } from '@apollo/client';
import { INSTALL_TOOL } from '../graphql/mutations';

import { useForm } from 'react-hook-form';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';

interface IFormValues {
    water: string;
    heating: string;
    electricity: string;
    energySaving: string;
}

const useInstallTool = (
    dataTools: ITools | null,
    setDataTools: React.Dispatch<React.SetStateAction<ITools | null>>
): IInstallToolHook => {
    const [installToolMutation] = useMutation(INSTALL_TOOL);
    const [isInstallToolModalOpen, setIsInstallToolModalOpen] = useState(false);

    const { register } = useForm<IFormValues>({ mode: 'onSubmit' });

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
            await installToolMutation({
                variables: {
                    label: toolLabel,
                    installed: updatedInstallStatus,
                },
            });
        } catch (error) {
            console.log('Failed to install tool:', error);
        }
    };

    const modalInstallToolContent = (
        <form className='flex flex-col gap-4'>
            {dataTools?.tools?.map((tool) => (
                <Checkbox
                    id={tool.id}
                    key={tool.id}
                    checkboxLabel={tool.label}
                    register={register}
                    onChange={(isChecked) =>
                        handleInstall(tool.label, isChecked)
                    }
                    checked={tool.installed}
                />
            ))}
            <div className='flex flex-row justify-end text-charcoal'>
                <Button
                    buttonType='button'
                    onClick={() => closeInstallToolModal()}
                >
                    Save
                </Button>
            </div>
        </form>
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
