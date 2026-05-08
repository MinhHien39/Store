export interface BaseStatus {
    isFirstTime: boolean;
    isVisible: boolean;
    isSelectAll: boolean;
}

export const InitBaseStatus = (): BaseStatus => ({
    isFirstTime: true,
    isVisible: false,
    isSelectAll: false,
});


export const SetFirstTime = (status: BaseStatus, isFirstTime: boolean): BaseStatus => ({
    ...status,
    isFirstTime: isFirstTime,
});

export const SetSelectAll = (status: BaseStatus, isSelectAll: boolean): BaseStatus => ({
    ...status,
    isSelectAll: isSelectAll,
});

export const ResetAllStatus = (): BaseStatus => ({
    isFirstTime: false,
    isVisible: false,
    isSelectAll: false,
});