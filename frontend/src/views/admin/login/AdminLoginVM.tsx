import { useEffect } from "react";

import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from '@/core/base/BaseViewModel';
import { ApiResultType } from '@/core/api';
import { t } from '@/core/localized';
import { ValidateUtils } from '@/core/utils';
import { UserRequest } from '@/data/repository/request/UserRequest';
import { UserRole } from '@/data/models/User';
import { useAppContext } from '@/provider/AppContextProvider';
import { useAppNavigation } from '@/application/AppNavigation';

interface Config extends BaseConfig {
    request: UserRequest;
    errorMsgList: string[];
    isShowPassword?: boolean;
}

interface Action extends BaseAction<Config> {
    onLoginClick: () => void;
}

export const AdminLoginVM: BaseViewModelFunc<Config, Action> = () => {
    const { userRepository } = useAppContext();

    const navigation = useAppNavigation();

    const { config, action, globalUI, appNavigation } = useBaseViewModel<Config>(
        AdminLoginVM.name,
        {
            request: new UserRequest(),
            errorMsgList: [],
            isShowPassword: false
        }
    );

    const onLoginClick = async () => {
        if (!isValidate()) {
            return;
        }
        globalUI.showProcessLoading();

        const request = config.request;
        request.roleId = UserRole.ADMIN;

        const result = await userRepository.doLogin(request);

        switch (result.type) {
            case ApiResultType.Success:
                globalUI.showSuccessAlert(t.auth.loginSuccess());
                navigation.afterLoginSuccess(result.data.user!, result.data.token!);
                break;
            case ApiResultType.Error:
                globalUI.handleApiError(result.error);
                break;
        }

        globalUI.hideProcessLoading();
    };

    const isValidate = () => {
        const emptyList: string[] = [];

        const errorMsgList: string[] = emptyList.concat(
            ValidateUtils.emailOrLoginId(config.request.emailOrUserId ?? ""),
            ValidateUtils.password(config.request.password ?? "")
        );

        if (errorMsgList.length > 0) {
            action.setNewConfig({
                ...config,
                errorMsgList: errorMsgList
            });
            return false;
        }
        return true;
    }

    useEffect(() => {
        action.onDidMount();

        return () => {
            action.onWillUnmount();
        };
    }, []);

    return {
        config,
        action: {
            ...action,
            onLoginClick
        },
        appNavigation
    };
};