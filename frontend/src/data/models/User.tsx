import BaseModel from './BaseModel';
import {
    AppConstant,
    DateFormat,
    DateUtils
} from '@/core/utils';
import { t } from '@/core/localized';

//、1：Admin、2：StoreUser
export enum UserRole {
    ADMIN = 1,
    STORE_USER = 2,
};

export namespace UserRole {
    const labelEntries = (): Array<[UserRole, string]> => [
        [UserRole.ADMIN, "Admin"],
        [UserRole.STORE_USER, t.status.user.storeUser()],
    ];

    export const Values: UserRole[] = Object.values(UserRole).filter(value => typeof value === 'number') as UserRole[];

    export const getLabel = (role: UserRole | number): string => {
        return labelEntries().find(([key]) => key === role)?.[1] ?? "";
    };
    export const fromLabel = (label: string): UserRole | undefined => {
        const entry = labelEntries().find(([_, value]) => value === label);
        return entry?.[0];
    };
}

// Unset=0, active=1, stopped=2
export enum UserStatus {
    TEMP = 0,
    ACTIVE = 1,
    INACTIVE = 2,
}

export namespace UserStatus {
    const labelEntries = (): Array<[UserStatus, string]> => [
        [UserStatus.TEMP, t.status.user.temp()],
        [UserStatus.ACTIVE, t.status.user.active()],
        [UserStatus.INACTIVE, t.status.user.inactive()],
    ];

    export const ValuesSelect: UserStatus[] = Object.values(UserStatus).filter(value => typeof value === 'number') as UserStatus[];

    // Ignor All
    export const Values: UserStatus[] = Object.values(UserStatus).filter(value => typeof value === 'number' && value !== UserStatus.TEMP) as UserStatus[];

    export const getLabel = (status: UserStatus | number): string => {
        return labelEntries().find(([key]) => key === status)?.[1] ?? "";
    };

    export const fromLabel = (label: string): UserStatus | undefined => {
        const entry = labelEntries().find(([_, value]) => value === label);
        return entry?.[0];
    };

    const StyleMap: Record<
        UserStatus,
        {
            backgroundColor: string;
            border: string;
            color: string;
        }
    > = {
        [UserStatus.TEMP]: {
            backgroundColor: "#fef3c7",
            border: "1px solid rgba(253, 224, 71, .22)",
            color: "#d1ceccc1",
        },
        [UserStatus.ACTIVE]: {
            backgroundColor: "#e8f7ee",
            border: "1px solid rgba(16, 185, 129, .22)",
            color: "#067a4a",
        },
        [UserStatus.INACTIVE]: {
            backgroundColor: "#f3f6fb",
            border: "1px solid rgba(34, 58, 92, .12)",
            color: "#465a75",
        },
    };

    export const getStyle = (status: UserStatus | number) => {
        return StyleMap[status as UserStatus] ?? StyleMap[UserStatus.ACTIVE];
    };
}


class User extends BaseModel {
    id: number;
    email: string;
    userId: number = AppConstant.USER_ID_DEFAULT;
    fullName: string;
    phone: string;
    roleId: number = AppConstant.ROLE_ID_DEFAULT;
    status: number = UserStatus.ACTIVE;

    getKeyId(): string {
        return `${this.id}_${this.roleId}`;
    }

    fromJson(json: Record<string, any>): this {
        this.mapBaseFromJson(json);
        this.id = json['id'];
        this.email = json['email'];
        this.userId = json['user_id'];
        this.fullName = json['full_name'];
        this.phone = json['phone'] ?? '';
        this.roleId = json['role_id'];
        this.status = json['status'];
        return this;
    }

    toJson(): object {
        return {
            id: this.id,
            email: this.email,
            user_id: this.userId,
            full_name: this.fullName,
            phone: this.phone,
            role_id: this.roleId,
            status: this.status,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }

    isAdmin(): boolean {
        return this.roleId === UserRole.ADMIN;
    }

    isStoreUser(): boolean {
        return this.roleId === UserRole.STORE_USER;
    }

    isTemp(): boolean {
        return this.status === AppConstant.USER_ID_DEFAULT;
    }

    isActive(): boolean {
        return this.status === UserStatus.ACTIVE;
    }

    isInactive(): boolean {
        return this.status === UserStatus.INACTIVE;
    }
}

export default User;
