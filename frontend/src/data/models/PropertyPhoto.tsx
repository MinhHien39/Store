import BaseModel from "./BaseModel";
import { AppConstant, DateFormat, DateUtils } from "@/core/utils";
import { t } from "@/core/localized";

export enum PropertyPhotoStatus {
    UN_TAKE_PHOTO = 1, // Not photographed
    UN_CONFIRM = 2,    // Unconfirmed
    APPROVED = 3,      // Approved
    REJECTED = 4,      // Rejected
    NEED_CONFIRM = 5,  // Needs confirmation
}

export namespace PropertyPhotoStatus {
    const labelEntries = (): Array<[PropertyPhotoStatus, string]> => [
        [PropertyPhotoStatus.UN_TAKE_PHOTO, t.status.propertyPhoto.notShot()],
        [PropertyPhotoStatus.UN_CONFIRM, t.status.propertyPhoto.unconfirmed()],
        [PropertyPhotoStatus.APPROVED, t.status.propertyPhoto.approved()],
        [PropertyPhotoStatus.REJECTED, t.status.propertyPhoto.rejected()],
        [PropertyPhotoStatus.NEED_CONFIRM, t.status.propertyPhoto.needConfirm()],
    ];

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
        return labelEntries().find(([key]) => key === status)?.[1] ?? "";
    };

    export const fromLabel = (label: string): PropertyPhotoStatus | undefined => {
        const entry = labelEntries().find(([_, value]) => value === label);
        return entry?.[0];
    };

    export const getStyle = (status: PropertyPhotoStatus | number) => {
        return StyleMap[status as PropertyPhotoStatus] ?? StyleMap[PropertyPhotoStatus.UN_TAKE_PHOTO];
    };
}

class PropertyPhoto extends BaseModel {
    id?: number;

    // Company ID.
    companyId?: number;

    // Property ID.
    propertyId?: number;

    // Template fields (dynamic key-value from property template)
    fields: Record<string, string | undefined> = {};

    // S3 Path 
    path?: string;

    // Presigned URL (resolved by backend)
    fileUrl?: string;

    // Worker name.
    workerName?: string;

    // Handling status.
    status: number = PropertyPhotoStatus.UN_TAKE_PHOTO;

    // Rejection reason.
    rejectionReason?: string;

    // Display number assigned by the database.
    no: number;

    // Temporary insertion position sent to the API when saving.
    insertAfterNo?: number;

    // Report S3 Path
    reportPath?: string;

    // Image upload date.
    uploadedAt?: Date;

    // Photo template ID retained for manager views.
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
