class StringUtils {

    static isEmpty(value: string): boolean {
        return (!value || value.length === 0 || (!value && value.trim().length === 0));
    }

    static isNotEmpty(value: string): boolean {
        return !StringUtils.isEmpty(value);
    }

    static convertListToString(valueList: string[], separator = ','): string {
        return valueList.join(separator);
    }

    static converToFloatString(value: any): string {
        try {
            return value.toFixed(1);
          } catch {
            return Number(0).toFixed(1);
        }
    }
}

export default StringUtils;