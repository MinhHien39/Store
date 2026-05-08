"use client";

import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { useAuthContext } from "@/provider/AuthContextProvider";
import { t } from "@/core/localized";
import type User from "@/data/models/User";

interface Config extends BaseConfig {
    user: User | null;
    isAuthenticated: boolean;
}

interface Action extends BaseAction<Config> {
    handleLogout: () => void;
}

export const AccountVM: BaseViewModelFunc<Config, Action> = () => {
    const { user, isAuthenticated, onLogout } = useAuthContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AccountVM.name,
        {
            user: null,
            isAuthenticated: false,
        }
    );

    const handleLogout = () => {
        globalUI.showDialog({
            content: t.confirm.logout(),
            onAgree: () => { onLogout(); },
            onClose: () => {},
        });
    };

    return {
        config: { ...config, user, isAuthenticated },
        action: { ...action, handleLogout },
    };
};
