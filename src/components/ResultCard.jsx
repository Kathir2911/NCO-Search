import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import ConfidenceBar from './ConfidenceBar';
import { logSelection, logOverride } from '../services/api';

export default function ResultCard({ result, onAction }) {
    const { hasPermission, isPublic } = useRole();

    const handleSelect = async () => {
        await logSelection(result.ncoCode, result.title);
        if (onAction) onAction('select', result);
    };

    const handleOverride = async () => {
        await logOverride('previous_code', result.ncoCode);
        if (onAction) onAction('override', result);
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
                        className="btn btn-primary action-btn"
                    >
                        ✓ Select
                    </button>
                )}

                {/* Override Button - Admin only */}
                {hasPermission('override') && (
                    <button
                        onClick={handleOverride}
                        className="btn btn-purple action-btn"
                    >
                        ⚡ Override
                    </button>
                )}
            </div>
        </div>
    );
}
