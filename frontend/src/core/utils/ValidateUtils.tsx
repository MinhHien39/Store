import StringUtils from "./StringUtils";
import AppConstant from "./AppConstant";

const ALPHA_NUMERIC_PATTERN = /^[a-zA-Z0-9!@#$%^&*()+$_]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_ID_PATTERN = /^[a-zA-Z0-9._-]+$/;
class ValidateUtils {

    static emailOrLoginId(value: string): string[] {
        const filedName = "メールアドレス/ユーザID";
        const inputPlease = "入力してください。";
        const msgList: string[] = [];

        if (value.length < 4) {
            msgList.push(`${filedName}は最低4文字${inputPlease}`);
        }
        return msgList;
    }

    static loginId(value: string): string[] {
        const filedName = "ログインID";
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${filedName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(value)) {
            msgList.push(`${filedName}はローマ字で${inputPlease}`);
        }

        if (value.length < 4) {
            msgList.push(`${filedName}は最低4文字${inputPlease}`);
        }

        return msgList;
    }

    static email(value: string): string[] {
        const fieldName = "メールアドレス";
        const inputPlease = "入力してください。";
        const invalidEmail = "形式が間違っています。";
    
        if (StringUtils.isEmpty(value)) {
            return [`${fieldName}を${inputPlease}`];
        }
    
        const msgList: string[] = [];
    
        if (!EMAIL_PATTERN.test(value)) {
            msgList.push(`${fieldName}の${invalidEmail}`);
        }
    
        return msgList;
    }

    static password(value: string): string[] {
        const filedName = "パスワード";
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${filedName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(value)) {
            msgList.push(`${filedName}の形式が間違っています。`);
        }

        if (value.length < 6) {
            msgList.push(`${filedName}は最低6文字${inputPlease}`);
        }

        return msgList;
    }


    static confirmPassword(password: string, confirmPassword: string): string[] {
        const filedName = "パスワード再確認";
        const inputPlease = "入力してください。";
        const invalidFormat = "の形式が間違っています。";

        if (StringUtils.isEmpty(confirmPassword)) {
            return [`${filedName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(confirmPassword)) {
            msgList.push(`${filedName}${invalidFormat}`);
        }

        if (confirmPassword.length < 6) {
            msgList.push(`${filedName}は最低6文字${inputPlease}`);
        }

        if (password.length > 0 && confirmPassword.length > 0 && confirmPassword !== password) {
            msgList.push(`パスワードとパスワード再確認が間違っています。`);
        }
        
        return msgList;
    }

    static fullName(value: string): string[] {
        const filedName = "指名";
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${filedName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(`${filedName}は最低6文字${inputPlease}`);
        }

        return msgList;
    }

    static lastName(value: string): string[] {
        const filedName = "姓";
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${filedName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(`${filedName}は最低6文字${inputPlease}`);
        }

        return msgList;
    }

    static firstName(value: string): string[] {
        const filedName = "名";
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${filedName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(`${filedName}は最低6文字${inputPlease}`);
        }

        return msgList;
    }


    static roleId(roleId: number): string[] {
        const filedName = "ロール";
        const inputPlease = "選択してください。";

        if (AppConstant.ROLE_ID_DEFAULT === roleId) {
            return [`${filedName}を${inputPlease}`];
        }
        return [];
    }

    static status(roleId: number): string[] {
        const filedName = "ステータス";
        const inputPlease = "選択してください。";

        if (AppConstant.STATUS_ID_DEFAULT === roleId) {
            return [`${filedName}を${inputPlease}`];
        }
        return [];
    }

    static userId(value: string): string[] {
        const fieldName = "ユーザID";
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${fieldName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (!USER_ID_PATTERN.test(value)) {
            msgList.push(`${fieldName}の形式が間違っています。`);
        }

        if (value.length < 4) {
            msgList.push(`${fieldName}は最低4文字${inputPlease}`);
        }

        return msgList;
    }

    static choice(value: string, fieldName: string): string[] {
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${fieldName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (!ALPHA_NUMERIC_PATTERN.test(value)) {
            // msgList.push(`${fieldName}${invalidFormat}`);
        }

        if (value.length < 4) {
            msgList.push(`${fieldName}は最低4文字${inputPlease}`);
        }

        return msgList;
    }

    static clientCode(value: string): string[] {
        const fieldName = "得意先コード";
        const inputPlease = "入力してください。";

        if (StringUtils.isEmpty(value)) {
            return [`${fieldName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (value.length < 1) {
            msgList.push(`${fieldName}は最低1文字${inputPlease}`);
        }

        return msgList;
    }

    static initialCreationLimit(value: number | undefined | null): string[] {
        const fieldName = "初期生成残数";
        const inputPlease = "入力してください。";
        const invalidNumber = "正の数で入力してください。";

        if (value === undefined || value === null) {
            return [`${fieldName}を${inputPlease}`];
        }

        const msgList: string[] = [];

        if (Number.isNaN(value)) {
            msgList.push(`${fieldName}を${invalidNumber}`);
        } else if (value <= 0) {
            msgList.push(`${fieldName}を${invalidNumber}`);
        }

        return msgList;
    }

    static templateSelection(templateId: number | undefined): string[] {
        const fieldName = "テンプレート";
        const inputPlease = "選択してください。";

        if (templateId === undefined) {
            return [`${fieldName}を${inputPlease}`];
        }

        return [];
    }

}

export default ValidateUtils;