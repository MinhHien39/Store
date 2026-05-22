import { DateUtils, DateFormat } from '@/core/utils';

export enum ModelActionMode {
    NONE = 0,
    ADD = 1,
    EDIT = 2,
    DELETE = 3
}

abstract class BaseModel {
    // Unique ID field.
    addressID = crypto.randomUUID();
    // Selection state for list views.
    isSelected: boolean = false;
    // Created date.
    createdAt?: Date;
    // Updated date.
    updatedAt?: Date;
    // Created by.
    createdBy?: string;
    // Updated by.
    updatedBy?: string;
    // Model action mode, such as add, edit, or delete.
    modelActionMode: ModelActionMode = ModelActionMode.NONE;

    abstract getKeyId(): string;

    abstract fromJson(json: Record<string, any>): this;

    abstract toJson(): Record<string, any>;

    isNoneMode(): boolean {
        return this.modelActionMode === ModelActionMode.NONE;
    }

    isAddMode(): boolean {
        return this.modelActionMode === ModelActionMode.ADD;
    }

    isEditMode(): boolean {
        return this.modelActionMode === ModelActionMode.EDIT;
    }

    isDeleteMode(): boolean {
        return this.modelActionMode === ModelActionMode.DELETE;
    }

    setNoneMode(): void {
        this.modelActionMode = ModelActionMode.NONE;
    }

    setAddMode(): void {
        this.modelActionMode = ModelActionMode.ADD;
    }

    setDeleteMode(): void {
        this.modelActionMode = ModelActionMode.DELETE;
    }

    setEditMode(): void {
        this.modelActionMode = ModelActionMode.EDIT;
    }

    isNotDeleteMode(): boolean {
        return this.modelActionMode !== ModelActionMode.DELETE;
    }

    clone<T extends BaseModel>(this: T): T {
        const cloned = Object.create(this.constructor.prototype);
        return Object.assign(cloned, this);
    }

    protected mapBaseFromJson(json: Record<string, any>) {
        this.createdAt = DateUtils.convertStringToDate(
            json.created_at ?? "",
            DateFormat.API
        );
        this.updatedAt = DateUtils.convertStringToDate(
            json.updated_at ?? "",
            DateFormat.API
        );
        this.createdBy = json["created_by"] ?? "";
        this.updatedBy = json["updated_by"] ?? "";
    }

    protected mapBaseToJson(): Record<string, any> {
        return {
            created_at: DateUtils.convertDateToString(this.createdAt, DateFormat.API),
            updated_at: DateUtils.convertDateToString(this.updatedAt, DateFormat.API),
            created_by: this.createdBy,
            updated_by: this.updatedBy,
            model_action_mode: this.modelActionMode,
        };
    }
}

export default BaseModel;
