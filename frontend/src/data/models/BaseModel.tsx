import { DateUtils, DateFormat } from '@/core/utils';

export enum ModelActionMode {
    NONE = 0,
    ADD = 1,
    EDIT = 2,
    DELETE = 3
}

abstract class BaseModel {
    // 一意のIDを生成するためのフィールド
    addressID = crypto.randomUUID();
    // 一覧表示用の選択状態
    isSelected: boolean = false;
    // 作成日時
    createdAt?: Date;
    // 更新日時
    updatedAt?: Date;
    // 作成者
    createdBy?: string;
    // 更新者
    updatedBy?: string;
    // モデルのアクションモード (追加、編集、削除など)
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