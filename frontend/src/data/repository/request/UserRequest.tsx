import BaseRequest from './BaseRequest';
import { AppConstant } from '@/core/utils';
import User, {
    UserRole,
    UserStatus
} from '@/data/models/User';

export class UserRequest extends BaseRequest {
    id?: number;
    email?: string;
    userId?: string;
    fullName?: string;
    password?: string;
    confirmPassword?: string;
    status?: number;
    roleId?: number;

    furigana?: string | null = null;
    phoneNumber?: string | null = null;
    address?: string | null = null;
    emailOrUserId: string;
    companySlug?: string | null = null;

    userList: User[] = [];
    userStatus?: number = AppConstant.STATUS_ID_DEFAULT;

    clone(): UserRequest {
        const cloned = new UserRequest();

        cloned.id = this.id;
        cloned.email = this.email;
        cloned.userId = this.userId;
        cloned.fullName = this.fullName;
        cloned.password = this.password;
        cloned.confirmPassword = this.confirmPassword;
        cloned.status = this.status;
        cloned.roleId = this.roleId;

        cloned.furigana = this.furigana;
        cloned.phoneNumber = this.phoneNumber;
        cloned.address = this.address;
        cloned.emailOrUserId = this.emailOrUserId;
        cloned.companySlug = this.companySlug;

        cloned.createdAt = this.createdAt;
        cloned.updatedAt = this.updatedAt;

        cloned.searchTerm = this.searchTerm;
        cloned.currentPage = this.currentPage;
        cloned.perPage = this.perPage;
        cloned.all = this.all;

        return cloned;
    }

    toLoginParameter(): Record<string, any> {
        const params: Record<string, any> = {};

        if (this.emailOrUserId) {
            params["email_or_user_id"] = this.emailOrUserId;
        }
        if (this.password) {
            params["password"] = this.password;
        }

        if (this.roleId) {
            params["role_id"] = this.roleId
        }
        if (this.companySlug) {
            params["company_slug"] = this.companySlug
        }

        return params;
    }

    toGetParameter(): Record<string, any> {
        const params: Record<string, any> = super.createParameters();

        if (this.roleId !== undefined) {
            params["role_id"] = this.roleId;
        }
        if (this.searchTerm) {
            params["search_term"] = this.searchTerm;
        }
        if (this.userStatus !== undefined && this.userStatus != AppConstant.DEFAULT_SELECT_ALL) {
            params["status"] = this.userStatus;
        }

        return params;
    }

    toRegisterParameter(): Record<string, any> {
        const params: Record<string, any> = {};

        if (this.fullName) {
            params["full_name"] = this.fullName;
        }
        if (this.email) {
            params["email"] = this.email;
        }
        if (this.userId) {
            params["user_id"] = this.userId;
        }
        if (this.password) {
            params["password"] = this.password;
        }
        if (this.status !== undefined) {
            params["status"] = this.status;
        }
        if (this.roleId !== undefined) {
            params["role_id"] = this.roleId;
        }

        if (this.furigana) {
            params["furigana"] = this.furigana;
        }
        if (this.phoneNumber) {
            params["phone_number"] = this.phoneNumber;
        }
        if (this.address) {
            params["address"] = this.address;
        }

        return params;
    }

    toUpdateParameter(): Record<string, any> {
        const params: Record<string, any> = {};

        if (this.fullName !== undefined) {
            params["full_name"] = this.fullName;
        }
        if (this.email !== undefined) {
            params["email"] = this.email;
        }
        if (this.userId !== undefined) {
            params["user_id"] = this.userId;
        }
        if (this.status !== undefined) {
            params["status"] = this.status;
        }
        if (this.roleId !== undefined) {
            params["role_id"] = this.roleId;
        }

        if (this.furigana !== undefined) {
            params["furigana"] = this.furigana;
        }
        if (this.phoneNumber !== undefined) {
            params["phone_number"] = this.phoneNumber;
        }
        if (this.address !== undefined) {
            params["address"] = this.address;
        }

        return params;
    }

    toDeleteParameter(): Record<string, any> {
        const dataList = this.userList.map(item => ({
            user_id: item.userId,
            role_id: item.roleId
        }));

        return { data_list: dataList };
    }

    static fromUser(user: User): UserRequest {
        const request = new UserRequest();

        request.id = user.id;
        request.fullName = user.fullName;
        request.email = user.email;
        request.userId = user.userId?.toString();
        request.status = user.status;
        request.roleId = user.roleId;
        request.phoneNumber = user.phoneNumber;
        request.furigana = user.furigana;
        request.address = user.address;
        request.createdAt = user.createdAt;
        request.updatedAt = user.updatedAt;

        return request;
    }

    static init(): UserRequest {
        const request = new UserRequest();

        request.id = AppConstant.USER_ID_DEFAULT;
        request.fullName = "";
        request.email = "";
        request.userId = "";
        request.password = "";
        request.confirmPassword = "";
        request.phoneNumber = "";
        request.furigana = "";
        request.address = "";
        request.status = UserStatus.ACTIVE;
        request.roleId = UserRole.MEMBER;
        request.createdAt = undefined;
        request.updatedAt = undefined;

        return request;
    }

    static initLogin(): UserRequest {
        const request = new UserRequest();

        request.emailOrUserId = ""
        request.password = "";
        request.roleId = -1;

        return request;
    }
}