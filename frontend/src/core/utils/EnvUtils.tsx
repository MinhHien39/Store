const ENV = process.env.NEXT_PUBLIC_MODE;

class EnvUtils {

    static isDebugMode(): boolean {
        return ENV === 'dev' || ENV === 'local';
    }
}

export default EnvUtils;