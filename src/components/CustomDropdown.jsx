import { useState, useRef, useEffect } from 'react';
import '../styles/CustomDropdown.css';

export default function CustomDropdown({ value, onChange, options, disabled }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } });
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`custom-dropdown ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
            <button
                type="button"
                className="custom-dropdown-button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="custom-dropdown-label">
                    {selectedOption ? selectedOption.label : 'Select...'}
                </span>
                <span className="custom-dropdown-arrow">
                    {isOpen ? '▲' : '▼'}
                </span>
            </button>

            {isOpen && (
                <div className="custom-dropdown-menu" role="listbox">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`custom-dropdown-option ${value === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                            role="option"
                            aria-selected={value === option.value}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
