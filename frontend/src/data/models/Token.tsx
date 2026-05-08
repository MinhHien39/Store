import BaseModel from "./BaseModel";

class Token extends BaseModel {
    getKeyId(): string {
        return "";
    }

    accessToken: string;
    refreshToken: string;
    accessExpirationTime: number;
    refreshExpirationTime: number;

    fromJson(json: Record<string, any>): this {
        this.accessToken = json['access_token'] ?? "";
        this.refreshToken = json['refresh_token'] ?? "";
        this.accessExpirationTime = json['access_expires_at'] ?? 0;
        this.refreshExpirationTime = json['refresh_expires_at'] ?? 0;
        return this;
    }

    toJson(): object {
        return {
            access_token: this.accessToken,
            refresh_token: this.refreshToken,
            access_expires_at: this.accessExpirationTime,
            refresh_expires_at: this.refreshExpirationTime
        };
    }
}

export default Token;