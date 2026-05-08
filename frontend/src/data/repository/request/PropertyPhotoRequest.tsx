import PropertyPhoto from '@/data/models/PropertyPhoto';
import BaseRequest from './BaseRequest';
import { AppConstant } from '@/core/utils';

export class PropertyPhotoRequest extends BaseRequest {
    id?: number;
    companyId?: number;
    propertyId?: number;
    files?: File[];
    fields: Record<string, string | undefined> = {};
    status?: number;
    rejectionReason?: string;
    templateId?: number;
    attachTemplateId?: boolean = false;
    attachFileUrl?: boolean = true;
    // 挿入位置：この no の直後に挿入（undefined = 末尾追加、0 = 先頭）
    insertAfterNo?: number;

    toRegisterParameter(): Record<string, any> {
        const params: Record<string, any> = {};
        const fields = { ...(this.fields ?? {}) };

        if (this.propertyId !== undefined) {
            params["property_id"] = this.propertyId;
        }

        params["fields"] = fields;

        if (this.insertAfterNo !== undefined) {
            params["insert_after_no"] = this.insertAfterNo;
        }
        if (this.rejectionReason !== undefined) {
            params["rejection_reason"] = this.rejectionReason;
        }

        return params;
    }

    toUpdateParameter(): Record<string, any> {
        const params: Record<string, any> = {};
        const fields = { ...(this.fields ?? {}) };

        if (this.id !== undefined) {
            params["id"] = this.id;
        }
        if (this.propertyId !== undefined) {
            params["property_id"] = this.propertyId;
        }

        params["fields"] = fields;

        if (this.status !== undefined) {
            params["status"] = this.status;
        }
        if (this.rejectionReason !== undefined) {
            params["rejection_reason"] = this.rejectionReason;
        }

        return params;
    }

    toUploadPhotoParameter(): FormData {
        const formData = new FormData();

        if (this.files && this.files.length > 0) {
            formData.append("files", this.files[0]);
        }
        return formData;
    }

    toUpdateStatusParameter(): Record<string, any> {
        const params: Record<string, any> = {};

        if (this.status !== undefined) {
            params["status"] = this.status;
        }
        if (this.rejectionReason !== undefined) {
            params["rejection_reason"] = this.rejectionReason;
        }

        return params;
    }

    toGetParameter(): Record<string, any> {
        const params: Record<string, any> = super.createParameters();

        if (this.companyId !== undefined) {
            params["company_id"] = this.companyId;
        }
        if (this.propertyId !== undefined) {
            params["property_id"] = this.propertyId;
        }

        if (this.status !== undefined && this.status !== AppConstant.DEFAULT_SELECT_ALL) {
            params["status"] = this.status;
        }

        if (this.searchTerm) {
            params["search_term"] = this.searchTerm;
        }
        if (this.attachTemplateId !== undefined) {
            params["attach_template_id"] = this.attachTemplateId;
        }
        if (this.attachFileUrl !== undefined) {
            params["attach_file_url"] = this.attachFileUrl;
        }
        return params;
    }

    toGetStatusCountParameter(): Record<string, any> {
        const params: Record<string, any> = {};

        if (this.propertyId !== undefined) {
            params["property_id"] = this.propertyId;
        }

        if (this.status !== undefined) {
            params["status"] = this.status;
        }

        if (this.searchTerm) {
            params["search_term"] = this.searchTerm;
        }

        return params;
    }

    toCreateReportParameter(): Record<string, any> {
        const params: Record<string, any> = {};
        if (this.propertyId !== undefined) {
            params["property_id"] = this.propertyId;
        }
        return params;
    }

    clone(): PropertyPhotoRequest {
        const cloned = new PropertyPhotoRequest();
        cloned.id = this.id;
        cloned.companyId = this.companyId;
        cloned.propertyId = this.propertyId;
        cloned.files = this.files;
        cloned.fields = { ...(this.fields ?? {}) };
        cloned.status = this.status;
        cloned.rejectionReason = this.rejectionReason;
        cloned.attachTemplateId = this.attachTemplateId;
        cloned.insertAfterNo = this.insertAfterNo;
        return cloned;
    }

    static fromPropertyPhoto(photo: PropertyPhoto): PropertyPhotoRequest {
        const request = new PropertyPhotoRequest();
        request.id = photo.id;
        request.companyId = photo.companyId;
        request.propertyId = photo.propertyId;
        request.fields = { ...(photo.fields ?? {}) };
        request.status = photo.status;
        request.rejectionReason = photo.rejectionReason;
        request.insertAfterNo = photo.insertAfterNo;
        return request;
    }

    getFieldValue(key: string): string | undefined {
        return this.fields?.[key];
    }

    setFieldValue(key: string, value: string | undefined): void {
        if (!this.fields) {
            this.fields = {};
        }
        this.fields[key] = value;
    }

}
