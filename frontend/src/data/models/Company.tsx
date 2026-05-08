import BaseModel from './BaseModel';
import { t } from "@/core/localized";
import { DateUtils, DateFormat } from "@/core/utils";
export enum CompanyStatus {
    NONE = 0,
    ACTIVE = 1,
    INACTIVE = 2,
}

export namespace CompanyStatus {
    export const StyleMap: Partial<Record<
        CompanyStatus,
        {
            backgroundColor: string;
            border: string;
            color: string;
        }
    >> = {
        [CompanyStatus.ACTIVE]: {
            backgroundColor: "#e8f7ee",
            border: "1px solid rgba(16, 185, 129, .22)",
            color: "#067a4a",
        },
        [CompanyStatus.INACTIVE]: {
            backgroundColor: "#f3f6fb",
            border: "1px solid rgba(34, 58, 92, .12)",
            color: "#465a75",
        },
    };

    export const Values: CompanyStatus[] =
        Object.values(CompanyStatus).filter(v => typeof v === "number" && v !== CompanyStatus.NONE) as CompanyStatus[];

    export const getLabel = (status: CompanyStatus | number): string => {
        switch (status) {
            case CompanyStatus.ACTIVE:
                return t.common.active();
            case CompanyStatus.INACTIVE:
                return t.common.inactive();
            default:
                return "";
        }
    };

    export const fromLabel = (label: string): CompanyStatus | string => {
        if (label === t.common.active()) {
            return CompanyStatus.ACTIVE;
        }
        if (label === t.common.inactive()) {
            return CompanyStatus.INACTIVE;
        }
        return "";
    };

    export const getStyle = (status: CompanyStatus | number) => {
        return StyleMap[status as CompanyStatus] ?? StyleMap[CompanyStatus.ACTIVE] ?? { backgroundColor: "#f3f6fb", border: "1px solid rgba(34, 58, 92, .12)", color: "#465a75" };
    };
}

class Company extends BaseModel {
    // ID
    id: number;

    // 会社コード（必須）
    code: string;

    // 会社名（必須）
    name: string;

    // メールアドレス（必須）
    email: string;

    // 初期生成残数（必須）
    initialCreationLimit: number = 0;

    // アラート表示閾値（必須）
    alertCreationLimit: number = 0;

    // ステータス（必須）
    status: number = CompanyStatus.ACTIVE;

    // 郵便番号（任意）
    postCode?: string;

    // 住所（任意）
    address?: string;

    // 電話番号（任意）
    phoneNumber?: string;

    // 担当者名（任意）
    managerName?: string;

    // 備考（任意）
    remarks?: string;
    
    propertyRemainInitCreationLimit?: number;

    fromJson(json: Record<string, any>): this {
        this.mapBaseFromJson(json);
        this.id = json["id"];
        this.code = json["code"];
        this.name = json["name"];
        this.email = json["email"];
        this.initialCreationLimit = json["initial_creation_limit"];
        this.alertCreationLimit = json["alert_creation_limit"] ?? 0;
        this.status = json["status"];
        this.postCode = json["post_code"];
        this.address = json["address"];
        this.phoneNumber = json["phone_number"];
        this.managerName = json["manager_name"];
        this.remarks = json["remarks"];
        this.propertyRemainInitCreationLimit = json["property_remain_init_creation_limit"];
        this.createdAt = DateUtils.convertStringToDate(
            json["created_at"],
            DateFormat.YYYY_MMM_DD_HH_MM_SS
        );
        this.updatedAt = DateUtils.convertStringToDate(
            json["updated_at"],
            DateFormat.YYYY_MMM_DD_HH_MM_SS
        );
        return this;
    }

    toJson(): object {
        return {
            id: this.id,
            code: this.code,
            name: this.name,
            email: this.email,
            initial_creation_limit: this.initialCreationLimit,
            alert_creation_limit: this.alertCreationLimit,
            status: this.status,
            post_code: this.postCode,
            address: this.address,
            phone_number: this.phoneNumber,
            manager_name: this.managerName,
            remarks: this.remarks,
            propertyRemainInitCreationLimit: this.propertyRemainInitCreationLimit,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }

    cloned(): Company {
        const data = new Company();
        data.id = this.id;
        data.code = this.code;
        data.name = this.name;
        data.email = this.email;
        data.initialCreationLimit = this.initialCreationLimit;
        data.alertCreationLimit = this.alertCreationLimit;
        data.status = this.status;
        data.postCode = this.postCode;
        data.address = this.address;
        data.phoneNumber = this.phoneNumber;
        data.managerName = this.managerName;
        data.remarks = this.remarks;
        data.propertyRemainInitCreationLimit = this.propertyRemainInitCreationLimit;
        data.createdAt = this.createdAt;
        data.updatedAt = this.updatedAt;
        return data;
    }

    getKeyId(): string {
        return String(this.id);
    }

    getUrl(): string {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        return `${origin}/${this.code}/manager/login`;
    }

    isCanCreateProperty(): boolean {
        return (this.propertyRemainInitCreationLimit ?? 0) > 0;
    }
}

export default Company;
