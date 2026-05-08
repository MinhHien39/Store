"use client";

import {
    BaseViewModelFunc,
    BaseConfig,
    BaseAction,
    useBaseViewModel,
} from "@/core/base/BaseViewModel";
import { ApiResultType } from "@/core/api";
import { useAppContext } from "@/provider/AppContextProvider";
import { t } from "@/core/localized";
import { UserRole } from "@/data/models/User";
import User from "@/data/models/User";
import Token from "@/data/models/Token";

interface Config extends BaseConfig {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    isSubmitting: boolean;
}

interface Action extends BaseAction<Config> {
    onRegisterClick: () => Promise<void>;
}

export const RegisterVM: BaseViewModelFunc<Config, Action> = () => {
    const { authRepository } = useAppContext();

    const { config, action, globalUI, appNavigation } = useBaseViewModel<Config>(
        RegisterVM.name,
        {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            showPassword: false,
            isSubmitting: false,
        }
    );

    const onRegisterClick = async () => {
        if (config.password !== config.confirmPassword) {
            globalUI.showErrorAlert(t.store.register.password_mismatch());
            return;
        }
        if (config.isSubmitting) return;
        action.setNewConfig({ isSubmitting: true });
        const result = await authRepository.register({
            full_name: config.name,
            email: config.email,
            password: config.password,
        });
        action.setNewConfig({ isSubmitting: false });
        if (result.type === ApiResultType.Success) {
            globalUI.showSuccessAlert(t.store.register.success());
            const user = new User().fromJson({ ...result.data.user, role_id: UserRole.STORE_USER });
            const token = new Token().fromJson(result.data.token);
            appNavigation.afterLoginSuccess(user, token);
        } else {
            globalUI.handleApiError(result.error);
        }
    };

    return {
        config,
        action: { ...action, onRegisterClick },
    };
};
