import Paging from '@/data/models/Paging';

class BaseResponse {
    paging?: Paging;

    constructor() {
        // No-Op
    }

    parseJson(json: Record<string, any>) {
        if (json["paging"]) {
            this.paging = new Paging().fromJson(json["paging"]);
        }
    }
}

export default BaseResponse;