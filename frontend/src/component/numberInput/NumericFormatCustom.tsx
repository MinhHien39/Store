import React, { useState, useEffect } from 'react';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    value?: string; // Accept initial value
    prefix?: string; // Optional prefix prop
    suffix?: string;// Optional suffix prop
    placeholder?: string; // Optional placeholder prop
}

const NumericFormatCustom = React.forwardRef<HTMLInputElement, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const {
            onChange,
            name,
            value = "", // Use initial value if provided
            prefix = "",
            suffix = "",
            placeholder = "",
            ...other
        } = props;

        const [formattedValue, setFormattedValue] = useState(value);

        // Update formattedValue if the initial value changes
        useEffect(() => {
            setFormattedValue(formatNumber(value));
        }, [value]);

        // Function to format the number with thousand separators
        const formatNumber = (val: string) => {
            return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = event.target.value.replace(/[^\d]/g, ""); // Only keep digits
            const formatted = formatNumber(rawValue); // Format with commas
            setFormattedValue(formatted);

            // Pass raw (unformatted) value to onChange
            onChange({
                target: {
                    name: name,
                    value: rawValue, // Unformatted value for processing
                },
            });
        };

        return (
            <input
                {...other}
                ref={ref}
                name={name}
                value={formattedValue ? `${prefix}${formattedValue}${suffix}` : ''}
                onChange={handleValueChange}
                placeholder={placeholder}
            />
        );
    }
);

export default NumericFormatCustom;
