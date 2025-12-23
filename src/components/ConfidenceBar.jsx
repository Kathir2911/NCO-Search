export default function ConfidenceBar({ confidence }) {
    // Convert confidence (0-1) to percentage
    const percentage = Math.round(confidence * 100);

    // Determine color class based on confidence level
    let colorClass = 'confidence-high';
    if (confidence < 0.6) {
        colorClass = 'confidence-low';
    } else if (confidence < 0.8) {
        colorClass = 'confidence-medium';
    }

    return (
        <div className="confidence-container">
            <div className="confidence-header">
                <span className="confidence-label">Confidence</span>
                <span className="confidence-value">{percentage}%</span>
            </div>
            <div className="confidence-bar-bg">
                <div
                    className={`confidence-bar-fill ${colorClass}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
