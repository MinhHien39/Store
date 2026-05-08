import BaseRequest from "./BaseRequest";

export class PasswordRequest extends BaseRequest {
    email: string = "";
    roleId?: number;
    token: string = "";
    oldPassword: string = "";
    newPassword: string = "";
    confirmNewPassword: string = "";

    clone(): PasswordRequest {
        const cloned = new PasswordRequest();

        cloned.email = this.email;
        cloned.roleId = this.roleId;
        cloned.token = this.token;
        cloned.oldPassword = this.oldPassword;
        cloned.newPassword = this.newPassword;
        cloned.confirmNewPassword = this.confirmNewPassword;

        return cloned;
    }

    toResetPasswordParameter(): Record<string, any> {
        const params: Record<string, any> = {};
        if (this.email) {
            params.email = this.email;
        }
        if (this.roleId) {
            params.role_id = this.roleId;
        }
        return params;
    }

    toCheckTokenParameter(): Record<string, any> {
        const params: Record<string, any> = {};
        if (this.token) {
            params["token"] = this.token;
        }
        return params;
    }

    toChangePasswordParameter(): Record<string, any> {
        const params: Record<string, any> = {};
        if (this.token) {
            params["token"] = this.token;
        }
        if (this.oldPassword) {
            params["old_password"] = this.oldPassword;
        }
        if (this.newPassword) {
            params["new_password"] = this.newPassword;
        }
        if (this.confirmNewPassword) {
            params["confirm_new_password"] = this.confirmNewPassword;
        }
        return params;
    }
}
