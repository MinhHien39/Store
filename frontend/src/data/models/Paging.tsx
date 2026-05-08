import BaseModel from "./BaseModel";

class Paging extends BaseModel {
    getKeyId(): string {
        return "";
    }

    currentPage: number;
    perPage: number;
    totalCount: number = 0;
    nextPage: number | null;
    totalPages: number = 0;

    fromJson(json: Record<string, any>): this {
        this.currentPage = json['current_page'];
        this.perPage = json['per_page'];
        this.totalCount = json['total_count'];
        this.nextPage = json['next_page'];
        this.totalPages = this.perPage > 0 ? Math.ceil(this.totalCount / this.perPage) : 1;
        return this;
    }

    toJson(): object {
        return {};
    }

    calculateNo(index: number): number {
        return (this.currentPage - 1) * this.perPage + index + 1;
    }
}

export default Paging;