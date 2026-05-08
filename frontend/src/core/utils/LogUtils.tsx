import EnvUtils from "./EnvUtils";

class LogUtils {
    static init(msg: unknown): void {
        LogUtils._log(() => console.log("iretoru ⇨ Initialize:", msg));
    }
    static debug(...args: unknown[]): void {
        LogUtils._log(() => console.log(`iretoru ⇨`, ...args));
    }

    static todo(msg: string): void {
        LogUtils._log(() => console.error("TODO TASK:", msg));
    }

    static group(tag: string, msg: string): void {
        LogUtils._log(() => console.group(`${tag}: ${msg}`));
    }

    static groupEnd(): void {
        LogUtils._log(() => console.groupEnd());
    }

    static error(...args: unknown[]): void {
        LogUtils._log(() => console.error(`iretoru ⇨`, ...args));
    }

    static warn(...args: unknown[]): void {
        LogUtils._log(() => console.warn(`iretoru ⇨`, ...args));
    }

    // Private helper to conditionally execute logging
    private static _log(logFn: () => void): void {
        if (EnvUtils.isDebugMode()) {
            logFn();
        }
    }
}

export default LogUtils;
