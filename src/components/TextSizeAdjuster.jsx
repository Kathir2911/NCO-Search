import { useState, useEffect } from 'react';
import '../styles/TextSizeAdjuster.css';

export default function TextSizeAdjuster() {
    const [fontSize, setFontSize] = useState(16);
    const MIN_SIZE = 12;
    const MAX_SIZE = 24;

    useEffect(() => {
        // Load saved font size from localStorage
        const savedSize = parseInt(localStorage.getItem('fontSize')) || 16;
        setFontSize(savedSize);
        applyFontSize(savedSize);
    }, []);

    const applyFontSize = (size) => {
        document.documentElement.style.fontSize = `${size}px`;
    };

    const increaseFontSize = () => {
        if (fontSize < MAX_SIZE) {
            const newSize = fontSize + 2;
            setFontSize(newSize);
            applyFontSize(newSize);
            localStorage.setItem('fontSize', newSize.toString());
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > MIN_SIZE) {
            const newSize = fontSize - 2;
            setFontSize(newSize);
            applyFontSize(newSize);
            localStorage.setItem('fontSize', newSize.toString());
        }
    };

    return (
        <div className="text-size-adjuster">
            <span className="text-size-label">Text Size:</span>
            <div className="text-size-buttons">
                <button
                    onClick={decreaseFontSize}
                    className="text-size-btn"
                    disabled={fontSize <= MIN_SIZE}
                    aria-label="Decrease text size"
                    title="Decrease text size"
                >
                    −
                </button>
                <span className="text-size-display">{fontSize}px</span>
                <button
                    onClick={increaseFontSize}
                    className="text-size-btn"
                    disabled={fontSize >= MAX_SIZE}
                    aria-label="Increase text size"
                    title="Increase text size"
                >
                    +
                </button>
            </div>
        </div>
    );
}
