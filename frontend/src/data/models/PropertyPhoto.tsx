import BaseModel from "./BaseModel";
import { AppConstant, DateFormat, DateUtils } from "@/core/utils";

export enum PropertyPhotoStatus {
    UN_TAKE_PHOTO = 1, // 未撮影
    UN_CONFIRM = 2,    // 未確認
    APPROVED = 3,      // 承認済み
    REJECTED = 4,      // 差し戻し
    NEED_CONFIRM = 5,  // 要確認
}

export namespace PropertyPhotoStatus {
    const LabelMap: Record<PropertyPhotoStatus, string> = {
        [PropertyPhotoStatus.UN_TAKE_PHOTO]: "未撮影",
        [PropertyPhotoStatus.UN_CONFIRM]: "未確認",
        [PropertyPhotoStatus.APPROVED]: "承認済み",
        [PropertyPhotoStatus.REJECTED]: "差し戻し",
        [PropertyPhotoStatus.NEED_CONFIRM]: "要確認",
    };

    export const StyleMap: Record<
        PropertyPhotoStatus,
        {
            background: string;
            backgroundColor: string;
            border: string;
            color: string;
            icon: string;
        }
    > = {
        [PropertyPhotoStatus.REJECTED]: {
            background: "",
            backgroundColor: "#fff5e6",
            border: "1px solid #ffd9a3",
            color: "#8a5a00",
            icon: "⚠",
        },
        [PropertyPhotoStatus.APPROVED]: {
            background: "",
            backgroundColor: "#eef7f0",
            border: "1px solid #bfe3c9",
            color: "#1f6b36",
            icon: "✓",
        },
        [PropertyPhotoStatus.NEED_CONFIRM]: {
            background: "linear-gradient(0deg, rgba(0,0,0,.05), rgba(0,0,0,.05)), repeating-linear-gradient(45deg, #F1F1F1, #F1F1F1 12px, #F7F7F7 12px, #F7F7F7 24px)",
            backgroundColor: "",
            border: "1px solid #dedede",
            color: "black",
            icon: "•",
        },
        [PropertyPhotoStatus.UN_CONFIRM]: {
            background: "",
            backgroundColor: "#eef4ff",
            border: "1px solid #b7cdf6",
            color: "#244f9c",
            icon: "•",
        },
        [PropertyPhotoStatus.UN_TAKE_PHOTO]: {
            background: "",
            backgroundColor: "#f5f5f5",
            border: "1px solid #d9d9d9",
            color: "#666666",
            icon: "○",
        }
    };

    export const Values: PropertyPhotoStatus[] =
        Object.values(PropertyPhotoStatus).filter(v => typeof v === "number") as PropertyPhotoStatus[];

    export const getLabel = (status: PropertyPhotoStatus | number): string => {
        return LabelMap[status as PropertyPhotoStatus] ?? "";
    };

    export const fromLabel = (label: string): PropertyPhotoStatus | undefined => {
        const entry = Object.entries(LabelMap).find(([_, v]) => v === label);
        return entry ? Number(entry[0]) as PropertyPhotoStatus : undefined;
    };

    export const getStyle = (status: PropertyPhotoStatus | number) => {
        return StyleMap[status as PropertyPhotoStatus] ?? StyleMap[PropertyPhotoStatus.UN_TAKE_PHOTO];
    };
}

class PropertyPhoto extends BaseModel {
    id?: number;

    // 会社ID
    companyId?: number;

    // 工事ID
    propertyId?: number;

    // Template fields (dynamic key-value from property template)
    fields: Record<string, string | undefined> = {};

    // S3 Path 
    path?: string;

    // Presigned URL (resolved by backend)
    fileUrl?: string;

    // 職人名
    workerName?: string;

    // 扱いステータス (未撮影, 未確認, 承認済み, 差し戻し, 要確認)
    status: number = PropertyPhotoStatus.UN_TAKE_PHOTO;

    // 差し戻し理由
    rejectionReason?: string;

    // 表示番号（DB採番。挿入・削除時に再採番される）
    no: number;

    // 挿入位置（一時的に保持、保存時に API へ送信、DB には保存しない）
    insertAfterNo?: number;

    // Report S3 Path
    reportPath?: string;

    // 画像アップロード日
    uploadedAt?: Date;

    // 撮影テンプレートID (冗長に保持) Used for Manager
    templateId?: number;

    getKeyId(): string {
        return `${this.companyId}_${this.propertyId}_${this.id}`;
    }

    getFieldValue(key: string): string | undefined {
        return this.fields?.[key];
    }

    getName(): string {
        return this.getFieldValue("name") ?? "";
    }

    setFieldValue(key: string, value: string | undefined): void {
        if (!this.fields) {
            this.fields = {};
        }
        this.fields[key] = value;
    }

    fromJson(json: Record<string, any>): this {
        this.mapBaseFromJson(json);
        this.id = json["id"];
        this.companyId = json["company_id"];
        this.propertyId = json["property_id"];
        this.templateId = json["template_id"];
        this.fields = json["fields"] ?? {};
        this.path = json["path"];
        this.fileUrl = json["file_url"];
        this.workerName = json["worker_name"];
        this.status = json["status"];
        this.rejectionReason = json["rejection_reason"];
        this.no = json["no"] !== undefined && json["no"] !== null ? Number(json["no"]) : 0;
        this.reportPath = json["report_path"];
        this.uploadedAt = DateUtils.convertStringToDate(json["uploaded_at"], DateFormat.API);
        return this;
    }

    toJson(): Record<string, any> {
        const json: Record<string, any> = {
            ...this.mapBaseToJson(),
            id: this.id,
            company_id: this.companyId,
            property_id: this.propertyId,
            template_id: this.templateId,
            fields: this.fields,
            path: this.path,
            worker_name: this.workerName,
            status: this.status,
            rejection_reason: this.rejectionReason,
            report_path: this.reportPath,
            uploadedAt: this.uploadedAt
        };
        return json;
    }

    getStatusLabel(): string {
        return PropertyPhotoStatus.getLabel(this.status);
    }

    getTakePhotoLabel(): string {
        return `${this.getStatusLabel()}`;
    }

    isValidId(): boolean {
        return this.id !== undefined && this.id !== AppConstant.ID_DEFAULT;
    }
}

export default PropertyPhoto;
