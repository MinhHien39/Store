import React, { useState, useEffect, useRef } from 'react';
import { Localized } from '@/core/localized';
import { ic_search } from '@/assets/images';

type InputSearchProps = {
  initialValue?: string;
  placeholder?: string;
  debounce?: number;
  onChange: (value: string) => void;
  onSearchClick: (value: string) => void;
  style?: React.CSSProperties;
  className?: string;
  maxLength?: number;
};

const InputSearch: React.FC<InputSearchProps> = ({
  initialValue = '',
  placeholder = Localized.t('common.search'),
  debounce = 300,
  onChange,
  onSearchClick,
  style = {},
  className = '',
  maxLength = 255
}) => {
  const [value, setValue] = useState(initialValue.trim());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousValueRef = useRef<string>(initialValue.trim());

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const trimmedValue = value.trim();
      const trimmedPrev = previousValueRef.current.trim();

      if (trimmedValue !== trimmedPrev) {
        previousValueRef.current = trimmedValue;
        onChange(trimmedValue);
      }
    }, debounce);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, debounce, onChange]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSearch = () => {
    previousValueRef.current = value;
    onSearchClick(value);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: 'var(--border-normal)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          padding: '0.25rem',
        }}
        className={className}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'normal',
            background: 'transparent'

          }}
          maxLength={maxLength}
        />
        <button
          type="button"
          onClick={handleSearch}
          style={{
            flexShrink: 0,
            padding: '0.25rem 0.5rem',
            cursor: 'pointer'
          }}
        >
          <img src={ic_search} alt="search" style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>
      </div>
    </div>
  );
};

export default InputSearch;