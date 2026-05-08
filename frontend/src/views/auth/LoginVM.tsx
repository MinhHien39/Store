"use client";

import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import { UserRole } from "@/data/models/User";
import User from "@/data/models/User";
import Token from "@/data/models/Token";

interface Config extends BaseConfig {
    email: string;
    password: string;
    showPassword: boolean;
    isSubmitting: boolean;
}

interface Action extends BaseAction<Config> {
    onLoginClick: () => Promise<void>;
}

export const LoginVM: BaseViewModelFunc<Config, Action> = () => {
    const { authRepository } = useAppContext();

    const { config, action, globalUI, appNavigation } = useBaseViewModel<Config>(
        LoginVM.name,
        {
            email: "",
            password: "",
            showPassword: false,
            isSubmitting: false,
        }
    );

    const onLoginClick = async () => {
        if (config.isSubmitting) return;
        action.setNewConfig({ isSubmitting: true });
        const result = await authRepository.login(config.email, config.password);
        action.setNewConfig({ isSubmitting: false });
        if (result.type === ApiResultType.Success) {
            const user = new User().fromJson({ ...result.data.user, role_id: UserRole.STORE_USER });
            const token = new Token().fromJson(result.data.token);
            appNavigation.afterLoginSuccess(user, token);
        } else {
            globalUI.handleApiError(result.error);
        }
    };

    return {
        config,
        action: { ...action, onLoginClick },
    };
};
