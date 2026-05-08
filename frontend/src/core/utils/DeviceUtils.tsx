class DeviceUtils {
    static isMobileScreen = () => {
        return window.innerWidth <= 768;
    }

    static isSafari(): boolean {
        const ua = navigator.userAgent;
        const vendor = navigator.vendor;

        // Safari 
        return /Safari/.test(ua) && !/Chrome|Chromium|CriOS|Android/.test(ua) && vendor === "Apple Computer, Inc.";
    }
}
export default DeviceUtils;