import React from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: React.ReactNode;
    checked: boolean;
    inVisible?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    inVisible,
    onChange,
    ...props
}) => {

    if (inVisible) {
        return <div className="base-checkbox"></div>
    }
    return (
        <label className="base-checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                {...props}
            />
            <span className="checkbox-box">
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 10.5L3.5 8l-1 1L6 12l7-7-1-1z" />
                </svg>
            </span>
            {label && <span className="checkbox-label">{label}</span>}
        </label>
    );
};

export default Checkbox;
