import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import ConfidenceBar from './ConfidenceBar';
import { logSelection, logOverride } from '../services/api';

export default function ResultCard({ result, onAction }) {
    const { hasPermission, isPublic } = useRole();
    const [isOverriding, setIsOverriding] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);

    const handleSelect = async () => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to select this occupation?\n\n${result.title} (${result.ncoCode})`
        );

        if (!confirmed) {
            return; // User cancelled
        }

        setIsSelecting(true);

        try {
            // Log the selection
            await logSelection(result.ncoCode, result.title);

            // Show success message
            alert(`✓ Selection successful!\n\nOccupation: ${result.title}\nNCO Code: ${result.ncoCode}`);

            // Notify parent component
            if (onAction) onAction('select', result);
        } catch (error) {
            alert('❌ Selection failed. Please try again.');
            console.error('Selection error:', error);
        } finally {
            setIsSelecting(false);
        }
    };

    const handleOverride = async () => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to override the selection to:\n\n${result.title} (${result.ncoCode})?`
        );

        if (!confirmed) {
            return; // User cancelled
        }

        setIsOverriding(true);

        try {
            // Log the override action
            await logOverride('AUTO_SELECTED', result.ncoCode);

            // Show success message
            alert(`✓ Override successful!\n\nOccupation: ${result.title}\nNCO Code: ${result.ncoCode}`);

            // Notify parent component
            if (onAction) onAction('override', result);
        } catch (error) {
            alert('❌ Override failed. Please try again.');
            console.error('Override error:', error);
        } finally {
            setIsOverriding(false);
        }
    };

    return (
        <div className="result-card">
            {/* Header */}
            <div className="result-header">
                <h3 className="result-title">{result.title}</h3>
                <p className="result-code">NCO Code: {result.ncoCode}</p>
            </div>

            {/* Hierarchy Breadcrumb */}
            <div className="hierarchy mb-3">
                {result.hierarchy?.map((level, idx) => (
                    <span key={idx} className="flex items-center">
                        {idx > 0 && <span className="hierarchy-separator">›</span>}
                        <span className="hierarchy-item">{level}</span>
                    </span>
                ))}
            </div>

            {/* Confidence Score (hidden in public mode) */}
            {!isPublic && result.confidence && (
                <div className="mb-3">
                    <ConfidenceBar confidence={result.confidence} />
                </div>
            )}

            {/* Matching Reason */}
            {result.reason && (
                <div className="match-reason mb-4">
                    <p className="match-reason-text">
                        <span className="font-medium">Match Reason:</span> {result.reason}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="actions">
                {/* View Details - always available */}
                <Link
                    to={`/enumerator/occupation/${result.ncoCode}`}
                    className="btn btn-outline action-btn"
                >
                    View Details
                </Link>

                {/* Select Button - Enumerator only */}
                {hasPermission('select') && (
                    <button
                        onClick={handleSelect}
                        disabled={isSelecting}
                        className="btn btn-primary action-btn"
                    >
                        {isSelecting ? '⏳ Selecting...' : '✓ Select'}
                    </button>
                )}

                {/* Override Button - Admin only */}
                {hasPermission('override') && (
                    <button
                        onClick={handleOverride}
                        disabled={isOverriding}
                        className="btn btn-purple action-btn"
                    >
                        {isOverriding ? '⏳ Overriding...' : '⚡ Override'}
                    </button>
                )}
            </div>
        </div>
    );
}
