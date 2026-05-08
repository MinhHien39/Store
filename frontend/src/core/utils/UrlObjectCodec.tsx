export enum UrlObjectCodeKey {
    INFO = 'info',
    REGISTER_INFO = 'register_info',
    ITEM_ID = 'item_id',
    TAB = "tab"
}

export class UrlObjectCodec {
    /**
     * Encode object to URL-safe string
     */
    static encode<T extends object>(data: T): string {
        try {
            const json = JSON.stringify(data);
            const uriEncoded = encodeURIComponent(json);
            return btoa(uriEncoded);
        } catch (e) {
            console.error('UrlObjectCodec.encode error', e);
            return '';
        }
    }

    /**
     * Decode URL-safe string back to object
     */
    static decode<T>(encoded: string): T | null {
        try {
            const uriDecoded = atob(encoded);
            const json = decodeURIComponent(uriDecoded);
            return JSON.parse(json) as T;
        } catch (e) {
            console.error('UrlObjectCodec.decode error', e);
            return null;
        }
    }

    /**
     * Append encoded object to URL as query param
     */
    static buildUrl<T extends object>(
        baseUrl: string,
        key: UrlObjectCodeKey,
        data: T
    ): string {
        const encoded = this.encode(data);
        if (!encoded) {
            return baseUrl;
        }
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}${key}=${encoded}`;
    }

    /**
     * Read & decode object from URL search params
     */
    static readFromUrl<T>(key: string): T | null {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(key);
        if (!value) {
            return null;
        }
        return this.decode<T>(value);
    }
}

/* 
- Encode Example

const info = {
  id: 'ORD-001',
  name : 'Sample Item'
};

const url = UrlObjectCodec.buildUrl(
  '/item',
  UrlObjectCodeKey.INFO,
  info
);

navigate(url);

- Decode Example
const info = UrlObjectCodec.readFromUrl<{
  id: string;
  name: string;
}>('info');
*/