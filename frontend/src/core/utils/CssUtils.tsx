export default class CssUtils {

    static convertRemToPixels(rem: number): number {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }
}