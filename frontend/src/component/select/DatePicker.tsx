import React, { useState } from 'react';
import "./style.css"

interface DatePickerProps {
    label: string;
    value: string | null;
    onChange: (value: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange }) => {
    const [focused, setFocused] = useState(false);
    const inputValue = value ? value.replace(/\//g, '-') : '';

    return (
        <div className='date-picker-wrapper'>
            <label
                className={`date-picker-label ${focused ? 'focused' : ''}`}
            >
                {label}
            </label>
            <input
                type="date"
                value={inputValue}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => {
                    const formatted = e.target.value.replace(/-/g, '/');
                    onChange(formatted);
                }}
                className='date-picker-input'
            />
        </div>
    );
};
export default DatePicker;