import { useState, useEffect } from 'react';
import { BaseStatus, InitBaseStatus } from "./BaseStatus";

import { LogUtils } from '@/core/utils';
import { useGlobalUI } from '@/provider/GlobalUIProvider';
import { useAppNavigation } from '@/application/AppNavigation';

export interface BaseConfig {
    status: BaseStatus;
}

export interface BaseAction<T> {
    setNewConfig: (newConfig: Partial<T>, shouldResetStatus?: boolean) => void;
    resetStatus: () => void;
    onDidMount: () => void;
    onWillUnmount: () => void;

    // Utility methods
    updateUrlQueryParams: (params: Record<string, string | number | undefined>, options?: { replace?: boolean }) => void;
    openNewTabUrl: (url: string) => void;
}

export type BaseViewModelFunc<
    Config extends BaseConfig,
    Action extends BaseAction<Config>,
    Argument extends object | void = void
> = (args: Argument) => {
    config: Config,
    action: Action,
    [key: string]: any
}

export type BaseViewModelReturn<Config> = {
    config: Config;
    action: BaseAction<Config>;
    globalUI: ReturnType<typeof useGlobalUI>;
    appNavigation: ReturnType<typeof useAppNavigation>;
};

export function useBaseViewModel<Config extends BaseConfig>(
    componentName: string,
    initialConfig: Omit<Config, 'status'> & { status?: BaseStatus },
): BaseViewModelReturn<Config> {

    const globalUI = useGlobalUI();

    const appNavigation = useAppNavigation();

    const [config, setConfig] = useState<Config>({
        ...initialConfig,
        status: initialConfig.status || InitBaseStatus(),
    } as Config);


    const setNewConfig = (newConfig: Partial<Config>, shouldResetStatus?: boolean) => {
        if (shouldResetStatus) {
            setConfig(prev => ({
                ...prev,
                status: InitBaseStatus(),
            }));

            setTimeout(() => {
                setConfig(prev => ({
                    ...prev,
                    ...newConfig,
                }));
            }, 10);
        } else {
            setConfig(prev => ({
                ...prev,
                ...newConfig,
            }));
        }
    }

    const resetStatus = () =>
        setConfig(prev => ({
            ...prev,
            status: InitBaseStatus(),
        }));

    const onDidMount = () => {
        // LogUtils.debug(`onDidMount: ${componentName}`);
    };

    const onWillUnmount = () => {
        //LogUtils.debug(`onWillUnmount: ${componentName}`);
    };

    const updateUrlQueryParams = (
        params: Record<string, string | number | null | undefined>,
        options?: { replace?: boolean }
    ) => {
        const searchParams = options?.replace
            ? new URLSearchParams()
            : new URLSearchParams(window.location.search);

        Object.entries(params).forEach(([key, value]) => {
            // Check null, undefined, '', NaN
            if (
                value === null ||
                value === undefined ||
                value === '' ||
                (typeof value === 'number' && isNaN(value))
            ) {
                searchParams.delete(key); // remove key if invalid value
            } else {
                searchParams.set(key, String(value)); //  set key if valid value
            }
        });

        const pathName = window.location.pathname;
        const query = searchParams.toString();
        const newUrl = query ? `${pathName}?${query}` : pathName;

        // LogUtils.debug(`updateUrlQueryParams: ${newUrl}`);
        window.history.replaceState(null, '', newUrl);
    };

    const openNewTabUrl = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    useEffect(() => {
        // No-Op
    }, []);

    return {
        config,
        action: {
            setNewConfig,
            resetStatus,
            onDidMount,
            onWillUnmount,
            updateUrlQueryParams,
            openNewTabUrl
        },
        globalUI,
        appNavigation
    };
}



// Example usage
/*

import { useEffect } from 'react';

import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel
} from "@/core/base/BaseViewModel"

import { useAppContext } from '@/provider';

interface Config extends BaseConfig  {
};

interface Action extends BaseAction<Config>  {
};

export const FuncVM: BaseViewModelFunc<Config, Action> = () => {
    const { repository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        FuncVM.name,
        { }
    );

    const fetchData = async () => {
        globalUI.showLoading();
        try {
            const data = await repository.getData();
            // Process data
        } catch (error) {
            globalUI.handleApiError(error);
        } finally {
            globalUI.hideLoading();
        }
    };

    useEffect(() => {
        action.onDidMount();
        fetchData();
        
        return () => {
            action.onWillUnmount();
        };
    }, []);

    return {
        config: config,
        action: {
            ...action,
        }
    }
};

*/