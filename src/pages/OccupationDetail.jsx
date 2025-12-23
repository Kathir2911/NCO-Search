import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOccupationDetails, logSelection } from '../services/api';
import { useRole } from '../context/RoleContext';
import LoadingState from '../components/LoadingState';
import RoleGuard from '../components/RoleGuard';

export default function OccupationDetail() {
    const { ncoCode } = useParams();
    const navigate = useNavigate();
    const { hasPermission } = useRole();
    const [occupation, setOccupation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOccupation();
    }, [ncoCode]);

    const loadOccupation = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getOccupationDetails(ncoCode);
            setOccupation(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSelection = async () => {
        await logSelection(occupation.ncoCode, occupation.title);
        alert(`✓ Confirmed selection: ${occupation.title}`);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="page">
                <LoadingState message="Loading occupation details..." />
            </div>
        );
    }

    if (error || !occupation) {
        return (
            <div className="page">
                <div className="container-md">
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p className="text-red-600 font-medium mb-4">
                            {error || 'Occupation not found'}
                        </p>
                        <Link to="/enumerator" className="btn btn-primary" style={{ display: 'inline-block' }}>
                            ← Back to Search
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container-md">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/enumerator" className="text-blue-600 hover:underline font-medium">
                        ← Back to Search
                    </Link>
                </div>

                {/* Main Card */}
                <div className="card">
                    {/* Header */}
                    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {occupation.title}
                        </h1>
                        <p className="text-xl" style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 500 }}>
                            NCO Code: {occupation.ncoCode}
                        </p>
                    </div>

                    {/* Hierarchy */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            Classification Hierarchy
                        </h2>
                        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                            <div>
                                {occupation.hierarchy?.map((level, idx) => (
                                    <div key={idx} className="flex items-center text-gray-700" style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#9ca3af', marginRight: '0.5rem' }}>
                                            {'  '.repeat(idx)}
                                            {idx > 0 && '↳'}
                                        </span>
                                        <span style={idx === occupation.hierarchy.length - 1 ? { fontWeight: 600, color: '#2563eb' } : {}}>
                                            {level}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            Description
                        </h2>
                        <p className="text-gray-700" style={{ lineHeight: '1.6' }}>
                            {occupation.description}
                        </p>
                    </div>

                    {/* Tasks */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">
                            Tasks Performed
                        </h2>
                        <ul style={{ listStyle: 'none' }}>
                            {occupation.tasks?.map((task, idx) => (
                                <li key={idx} className="flex items-start" style={{ marginBottom: '0.5rem' }}>
                                    <span className="text-blue-600" style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}>•</span>
                                    <span className="text-gray-700">{task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related Occupations */}
                    {occupation.relatedOccupations && occupation.relatedOccupations.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                Related Occupations
                            </h2>
                            <div className="grid grid-cols-2 gap-3">
                                {occupation.relatedOccupations.map((related) => (
                                    <Link
                                        key={related.ncoCode}
                                        to={`/enumerator/occupation/${related.ncoCode}`}
                                        style={{
                                            display: 'block',
                                            padding: '1rem',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '0.5rem',
                                            border: '1px solid #e5e7eb',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#eff6ff';
                                            e.currentTarget.style.borderColor = '#93c5fd';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f9fafb';
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                        }}
                                    >
                                        <p className="font-medium text-gray-900">{related.title}</p>
                                        <p className="text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>{related.ncoCode}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6" style={{ borderTop: '1px solid #e5e7eb' }}>
                        <Link
                            to="/enumerator"
                            className="btn btn-secondary"
                        >
                            ← Back to Search
                        </Link>

                        {/* Confirm Selection - Enumerator only */}
                        <RoleGuard permission="select">
                            <button
                                onClick={handleConfirmSelection}
                                className="btn btn-primary"
                            >
                                ✓ Confirm Selection
                            </button>
                        </RoleGuard>
                    </div>
                </div>
            </div>
        </div>
    );
}
