import { useEffect } from 'react';
import { useLocation } from "react-router-dom";

import { BaseViewModelFunc, BaseConfig, BaseAction, useBaseViewModel } from '@/core/base/BaseViewModel';
import { t } from '@/core/localized';
import { LogUtils } from '@/core/utils';
import { SideBarProps } from '@/component';
import { useAppNavigation } from '@/application/AppNavigation';
import { AppRoutePath } from '@/application/AppRoutePath';
import { UserRole } from '@/data';
import { useAppContext } from '@/provider/AppContextProvider';

interface Config extends BaseConfig {
    sideBarProps?: SideBarProps;
};

interface Action extends BaseAction<Config> {
};

export const AdminHomeVM: BaseViewModelFunc<Config, Action> = () => {

    const useAppnavigation = useAppNavigation();
    const { userRepository } = useAppContext();

    const { config, action, globalUI } = useBaseViewModel<Config>(
        AdminHomeVM.name,
        {
            sideBarProps: undefined,
        }
    );

    const onLogout = async () => {
        globalUI.showDialog({
            content: t.confirm.logout(),
            onAgree: async () => {
                await userRepository.doAdminLogout();
                globalUI.showSuccessAlert(t.message.logoutSuccess());
                useAppnavigation.toLogin(UserRole.ADMIN);
            },
            onClose: () => { }
        })
    }

    const createSizeBarProps = (): SideBarProps => {
        return {
            index: 0,
            itemList: [
                {
                    title: t.admin_sidebar.dashboard(),
                    href: AppRoutePath.ADMIN_DASHBOARD
                },
            ],
            onLogout: onLogout
        }
    };

    useEffect(() => {
        action.onDidMount();

        config.sideBarProps = createSizeBarProps();
        action.setNewConfig(config);

        return () => {
            action.onWillUnmount();
        };
    }, []);

    return {
        config: config,
        action: {
            ...action
        }
    }
};