import dayjs from 'dayjs';
import LogUtils from './LogUtils';

type Era = {
    symbol: string; // "H"  Heisei
    name: string;   // "平成"
    start: string;  // YYYY-MM-DD
    yearOffset: number; // 0
};

const eras: Era[] = [
    { symbol: 'R', name: '令和', start: '2019-05-01', yearOffset: 2018 },
    { symbol: 'H', name: '平成', start: '1989-01-08', yearOffset: 1988 },
    { symbol: 'S', name: '昭和', start: '1926-12-25', yearOffset: 1925 },
    { symbol: 'T', name: '大正', start: '1912-07-30', yearOffset: 1911 },
    { symbol: 'M', name: '明治', start: '1868-01-25', yearOffset: 1867 },
];

// https://day.js.org/docs/en/display/format#list-of-localized-formats
export enum DateFormat {
    API = 'YYYY-MM-DDTHH:mm:ss',

    YYYY_MM_DD = 'YYYY/MM/DD',

    YYYY_MM_DD_MINUS = 'YYYY-MM-DD',

    YYYY_MMM_DD_NO_SLASH = 'YYYYMMDD',

    YYYY_MMM_DD_HH_MM_SS = 'YYYY/MM/DD HH:mm:ss',

    YYYY_MMM_DD_HH_MM_SS_MINUS = 'YYYY-MM-DD HH:mm:ss',

    HH_MM = 'HH:mm',

    HH_MM_SS = 'HH:mm:ss',

    SS = 'ss',

    YYYY_MM = 'YYYY/MM',

    YYYY年MM月DD日 = 'YYYY年MM月DD日',

    YYYY年MM月 = 'YYYY年MM月',

    MM月DD日 = 'MM月DD日',

    // 2023年07月05日 (水)"
    MM月DD日DDD = 'MM月DD日 (ddd)',

    YYYY年MM月DD日DDD = 'YYYY年MM月DD日 (ddd)',

    YYYY年MM月DD日DDD_HHMMSS = 'YYYY年MM月DD日 (ddd) HH:mm:ss',

    M_D_DDD = 'M/D (ddd)',

    M_DD_DDD = 'M/DD (ddd)',

    YYYYMMDD_DOT = "YYYY.MM.DD"
}

class DateUtils {

    static LOCATE_DEFAULT = "ja";

    static isValidDate(date: any): boolean {
        return DateUtils.isInvalidDate(date) === false;
    }

    static isInvalidDate(date: any): boolean {
        if (date === null || date === undefined) {
            return true;
        }

        if (!(date instanceof Date)) {
            return true;
        }

        if (isNaN(date.getTime())) {
            return true;
        }

        return false;
    }

    static convertAnyToString(date?: Date | string, outputFormat = DateFormat.YYYY_MM_DD, locale = DateUtils.LOCATE_DEFAULT): string {
        try {
            if (!date) {
                return "";
            }
            let parsedDate;

            if (typeof date === "string") {
                parsedDate = dayjs(date);

            } else if (date instanceof Date) {
                parsedDate = dayjs(date);
            } else {
                return "";
            }

            if (parsedDate) {
                return parsedDate.locale(locale).format(outputFormat);
            }
            return "";
        } catch (error) {
            LogUtils.error(error);
            return "";
        }
    }

    // YYYY/MM/DD
    static convertDateToString(
        date?: Date,
        outputFormat = DateFormat.YYYY_MM_DD,
        locale = DateUtils.LOCATE_DEFAULT
    ): string {
        try {
            if (date) {
                return dayjs(date).locale(locale).format(outputFormat);
            }
            return ""
        } catch (error) {
            LogUtils.error(error);
            return "";
        }
    }

    static convertStringToDate(dateString: string, inputFormat: string): Date | undefined {
        if (!dateString) {
            return undefined;
        }
        return dayjs(dateString, inputFormat).toDate();
    }


    static convertToWareki(date: string | Date): string {
        try {
            const targetDate = dayjs(date);

            for (const era of eras) {
                const eraStartDate = dayjs(era.start);
                if (targetDate.isAfter(eraStartDate) || targetDate.isSame(eraStartDate)) {
                    const yearInEra = targetDate.year() - era.yearOffset;
                    const formattedYear = yearInEra === 1 ? '元' : yearInEra;
                    return `${era.symbol}${formattedYear}.${targetDate.month() + 1}.${targetDate.date()}`;
                }
            }

            return targetDate.format('YYYY年M月D日');
        }
        catch {
            return ""
        }
    }

    static diffFromTodayJpFormat(date: Date): string {
        const start = dayjs(date);
        const now = dayjs();

        const years = now.diff(start, 'year');
        const months = now.diff(start.add(years, 'year'), 'month');

        return `${years}年${months}カ月`;
    }

    static diffInJpFormat(startDate: Date | string, endDate: Date | string): string {
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        const years = end.diff(start, 'year');
        const months = end.diff(start.add(years, 'year'), 'month');

        return `${years}年${months}カ月`;
    }

    static diffInMonthsPlusTwo(startDate: Date | string, endDate: Date | string): number {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const monthsDiff = end.diff(start, 'month');
        return monthsDiff + 2;
    }

    static isDateAGreaterThanB(a: string | Date, b: string | Date): boolean {
        const dateA = dayjs(a);
        const dateB = dayjs(b);
        return dateA.isAfter(dateB); 
    };

    static isDateALessThanB(a: string | Date, b: string | Date): boolean {
        const dateA = dayjs(a);
        const dateB = dayjs(b);
        return dateA.isBefore(dateB); 
    };

    static isMonthYearALessThanB(a: string | Date, b: string | Date): boolean {
        const dateA = dayjs(a).startOf('month'); 
        const dateB = dayjs(b).startOf('month'); 
    
        return dateA.isBefore(dateB); 
    }

    static isSameMonthAndYear(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth();
    }

    static isDifferentDate(date1: Date, date2: Date): boolean {
        return date1.getFullYear() !== date2.getFullYear() ||
            date1.getMonth() !== date2.getMonth() ||
            date1.getDate() !== date2.getDate();
    }

    static today(): Date {
        return dayjs().toDate();
    }
}

export default DateUtils;