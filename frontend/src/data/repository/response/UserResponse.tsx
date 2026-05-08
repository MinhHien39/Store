import BaseResponse from './BaseResponse';
import Token from '@/data/models/Token';
import User from '@/data/models/User';

export class UserResponse extends BaseResponse {
    items: User[] = [];
    user: User | null = null;
    token: Token | null = null;

    fromGetListJson(json: any): this {
        super.parseJson(json);

        if (Array.isArray(json["items"])) {
            this.items = json["items"].map(
                item => new User().fromJson(item)
            );
        }

        return this;
    }

    fromLoginJson(json: any): this {
        super.parseJson(json);

        if (json["user"]) {
            this.user = new User().fromJson(json["user"]);
        }

        if (json["token"]) {
            this.token = new Token().fromJson(json["token"]);
        }

        return this;
    }
}
