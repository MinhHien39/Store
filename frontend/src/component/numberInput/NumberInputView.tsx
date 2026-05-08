import React, { useState, useEffect } from 'react';

interface NumberInputViewProps {
    value?: string; 
    onChange: (value: number) => void; 
    prefix?: string; 
    suffix?: string; 
    placeholder?: string; 
    styles?: object
}

const NumberInputView: React.FC<NumberInputViewProps> = ({
    value = '',
    onChange,
    prefix = '',
    suffix = '',
    placeholder = '',
    styles = {}
}) => {
    const [displayValue, setDisplayValue] = useState<string>(value);

    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        if (!isFocused) {
            setDisplayValue(`${prefix}${formatValue(value)}${suffix}`);
        } else {
            setDisplayValue(formatValue(value));
        }
    }, [value, isFocused, prefix, suffix]);

    /*
    const formatValue = (val: string): string => {
        const numericValue = val.replace(/[^\d]/g, ''); 
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/[^\d]/g, ''); 
        setDisplayValue(formatValue(rawValue));
        onChange(Number(rawValue)); 
    };
    */

    const formatValue = (val: string): string => {
        const isNegative = val.startsWith('-');
        const numericValue = val.replace(/[^\d.]/g, '');
        const parts = numericValue.split('.'); 
    
        if (parts.length > 2) return (isNegative ? '-' : '') + parts[0]; 
        
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
        
        return (isNegative ? '-' : '') + parts.join('.'); 
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value.replace(/[^-\d.]/g, ''); 
    
        const sanitizedValue = rawValue.startsWith('-')
            ? '-' + rawValue.slice(1).replace(/-/g, '') 
            : rawValue.replace(/-/g, ''); 
    
        setDisplayValue(formatValue(sanitizedValue));
    
        const numericValue = Number(sanitizedValue);
        if (!isNaN(numericValue)) {
            onChange(numericValue);
        } else {
            onChange(0);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <input
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            style={{ 
                ...styles 
            }}
        />
    );
};

export default NumberInputView;
