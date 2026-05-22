import StringUtils from "./StringUtils";
import AppConstant from "./AppConstant";
import { t } from "@/core/localized";

const ALPHA_NUMERIC_PATTERN = /^[a-zA-Z0-9!@#$%^&*()+$_]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_ID_PATTERN = /^[a-zA-Z0-9._-]+$/;
class ValidateUtils {
    private static required(field: string): string {
        return t.validation.required({ field });
    }

    private static minLength(field: string, count: number): string {
        return t.validation.minLength({ field, count });
    }

    private static invalidFormat(field: string): string {
        return t.validation.invalidFormat({ field });
    }

    static emailOrLoginId(value: string): string[] {
        const fieldName = t.validation.field.emailOrUserId();
        const msgList: string[] = [];

        if (value.length < 4) {
            msgList.push(this.minLength(fieldName, 4));
        }
        return msgList;
    }

    static loginId(value: string): string[] {
        const fieldName = t.validation.field.loginId();

        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(value)) {
            msgList.push(t.validation.latinOnly({ field: fieldName }));
        }

        if (value.length < 4) {
            msgList.push(this.minLength(fieldName, 4));
        }

        return msgList;
    }

    static email(value: string): string[] {
        const fieldName = t.validation.field.email();
    
        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }
    
        const msgList: string[] = [];
    
        if (!EMAIL_PATTERN.test(value)) {
            msgList.push(this.invalidFormat(fieldName));
        }
    
        return msgList;
    }

    static password(value: string): string[] {
        const fieldName = t.validation.field.password();

        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(value)) {
            msgList.push(this.invalidFormat(fieldName));
        }

        if (value.length < 6) {
            msgList.push(this.minLength(fieldName, 6));
        }

        return msgList;
    }


    static confirmPassword(password: string, confirmPassword: string): string[] {
        const fieldName = t.validation.field.confirmPassword();

        if (StringUtils.isEmpty(confirmPassword)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(confirmPassword)) {
            msgList.push(this.invalidFormat(fieldName));
        }

        if (confirmPassword.length < 6) {
            msgList.push(this.minLength(fieldName, 6));
        }

        if (password.length > 0 && confirmPassword.length > 0 && confirmPassword !== password) {
            msgList.push(t.validation.passwordMismatch());
        }
        
        return msgList;
    }

    static fullName(value: string): string[] {
        const fieldName = t.validation.field.fullName();

        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(this.minLength(fieldName, 1));
        }

        return msgList;
    }

    static lastName(value: string): string[] {
        const fieldName = t.validation.field.lastName();

        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(this.minLength(fieldName, 1));
        }

        return msgList;
    }

    static firstName(value: string): string[] {
        const fieldName = t.validation.field.firstName();

        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(this.minLength(fieldName, 1));
        }

        return msgList;
    }


    static roleId(roleId: number): string[] {
        const fieldName = t.validation.field.role();

        if (AppConstant.ROLE_ID_DEFAULT === roleId) {
            return [t.validation.pleaseSelect({ field: fieldName })];
        }
        return [];
    }

    static status(roleId: number): string[] {
        const fieldName = t.validation.field.status();

        if (AppConstant.STATUS_ID_DEFAULT === roleId) {
            return [t.validation.pleaseSelect({ field: fieldName })];
        }
        return [];
    }

    static userId(value: string): string[] {
        const fieldName = t.validation.field.userId();

        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (!USER_ID_PATTERN.test(value)) {
            msgList.push(this.invalidFormat(fieldName));
        }

        if (value.length < 4) {
            msgList.push(this.minLength(fieldName, 4));
        }

        return msgList;
    }

    static choice(value: string, fieldName: string): string[] {
        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(value)) {
            // msgList.push(`${fieldName}${invalidFormat}`);
        }

        if (value.length < 4) {
            msgList.push(this.minLength(fieldName, 4));
        }

        return msgList;
    }

    static clientCode(value: string): string[] {
        const fieldName = t.validation.field.customerCode();

        if (StringUtils.isEmpty(value)) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(this.minLength(fieldName, 1));
        }

        return msgList;
    }

    static initialCreationLimit(value: number | undefined | null): string[] {
        const fieldName = t.validation.field.initialCredit();

        if (value === undefined || value === null) {
            return [this.required(fieldName)];
        }

        const msgList: string[] = [];

        if (Number.isNaN(value)) {
            msgList.push(t.validation.positiveNumber({ field: fieldName }));
        } else if (value <= 0) {
            msgList.push(t.validation.positiveNumber({ field: fieldName }));
        }

        return msgList;
    }

    static templateSelection(templateId: number | undefined): string[] {
        const fieldName = t.validation.field.template();

        if (templateId === undefined) {
            return [t.validation.pleaseSelect({ field: fieldName })];
        }

        return [];
    }

}

export default ValidateUtils;
