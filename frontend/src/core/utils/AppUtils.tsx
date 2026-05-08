import LogUtils from "./LogUtils";

export class AppRegex {
   static FORMULA = /^[+\-*/%]/;
};

class AppUtils {

    static delay(ms = 100) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static roundDown(value: number, decimalPlaces: number = 4): number {
        const factor = Math.pow(10, decimalPlaces);
        return Math.floor(value * factor) / factor;
    };

    static formatNumber(value: number, format: string = ","): string {
        const roundDownValue = AppUtils.roundDown(value, 0);
        return roundDownValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, format);
    }

    static sanitizeValue(value: any): number {
        if (
            value === null || // null
            value === undefined || // undefined
            typeof value === "number" && (isNaN(value) || !isFinite(value)) || // NaN or Infinity
            typeof value !== "number" // !number
        ) {
            return 0;
        }

        return value;
    }

    static isPdfUrl(url: string): boolean {
        try {
            const pathname = new URL(url).pathname;
            return pathname.toLowerCase().endsWith('.pdf');
        } catch {
            return false;
        }
    };

    static isPdfFile(file: File): boolean {
        try {
            return file.type === "application/pdf" || file.name.toLowerCase().endsWith('.pdf');
        } catch {
            return false;
        }
    };

    // != [null, undefined, 0, '', false, NaN]
    static isValid(value: any): boolean {
        return !!value;
    }

    static isInvalid(value: any): boolean {
        return !AppUtils.isValid(value);
    };


    static isValidObject(obj: any): boolean {
        return obj && typeof obj === "object" && Object.keys(obj).length > 0;
    }

    /**
     * Calculates the result based on the given formula and initial value.
     * @param value - The current numeric value.
     * @param formula - The formula to apply (e.g., +10, -5, *2, /2).
     * @returns The calculated result or null if invalid.
     */
    static calculateFormula(value: number, formula: string): number {
        try {
            // Return the original value if the formula is empty
            if (!formula || formula.trim() === "") {
                return value;
            }
    
            // Validate if the formula starts with a valid operator
            if (!AppRegex.FORMULA.test(formula.trim())) {
                LogUtils.error("Formula must start with +, -, *, or /");
                return value;
            }
    
            // Extract the operator and number separately
            const operator = formula.trim().charAt(0); // +, -, *, /
            const number = parseFloat(formula.trim().slice(1)); // Extract the number after the operator
    
            // Check if the number is valid
            if (isNaN(number)) {
                LogUtils.error("Invalid number in formula");
                return value;
            }
    
            // Perform the calculation based on the operator
            switch (operator) {
                case '+':
                    return value + number;
                case '-':
                    return value - number;
                case '*':
                    return value * number;
                case '/':
                    if (number === 0) {
                        LogUtils.error("Division by zero error");
                        return value;
                    }
                    return value / number;
                    case '%': {
                        return (value * number) / 100;
                    }
                default:
                    LogUtils.error("Unsupported operator");
                    return value;
            }
        } catch (error) {
            LogUtils.error(`Error during formula calculation: ${error}`);
            return value;
        }
    };

    static exportCSV = (
        fileName: string,
        querySelector: string,
    ) => {
        const table = document.querySelector(querySelector);
        if (!table) {
            LogUtils.error(`Table element not found for selector: ${querySelector}`);
            return;
        }
        const rows = Array.from(table.querySelectorAll('tr'));
        const csvData: string[][] = [];
        rows.forEach((row, rowIndex) => {
            let csvRow: string[] = csvData[rowIndex] || [];
            const cells = Array.from(row.querySelectorAll('th, td'));
            let colIndex = 0;
            cells.forEach((cell) => {
                while (csvRow[colIndex] !== undefined) {
                    colIndex++;
                }
                const value = (cell as HTMLElement).innerText.trim().replace(/"/g, '""');
                const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
                const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);

                csvRow[colIndex] = `"${value}"`;
                for (let i = 1; i < colspan; i++) {
                    csvRow[colIndex + i] = '';
                }
                for (let j = 1; j < rowspan; j++) {
                    if (!csvData[rowIndex + j]) csvData[rowIndex + j] = [];
                    csvData[rowIndex + j][colIndex] = '';
                }
                colIndex += colspan;
            });
            csvData[rowIndex] = csvRow;
        });
        const csvContent = csvData.map(row => row.join(',')).join('\r\n');
        const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

        const csvBlob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const csvLink = document.createElement('a');
        csvLink.href = URL.createObjectURL(csvBlob);
        csvLink.download = `${fileName}_${currentDate}.csv`;
        csvLink.click();
    };
}    

export default AppUtils;