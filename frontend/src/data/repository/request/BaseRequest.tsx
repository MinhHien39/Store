import { AppConstant } from '@/core/utils';

export enum SortDirection {
    ASC = "asc",
    DESC = "desc",
}

abstract class BaseRequest {
    searchTerm?: string;

    currentPage: number = AppConstant.CURRENT_PAGE_DEFAULT;

    perPage: number = AppConstant.PER_PAGE_DEFAULT;

    all?: string;

    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;

    createParameters(): Record<string, any> {
        const params: Record<string, any> = {
            page: this.currentPage,
            per_page: this.perPage,
        };

        if (this.searchTerm && this.searchTerm.trim().length > 0) {
            params["search_term"] = this.searchTerm.trim();
        }

        if (this.all) {
            params["all"] = this.all;
        }

        return params;
    }
}

export default BaseRequest;