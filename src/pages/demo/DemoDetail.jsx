import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOccupationDetails } from '../../services/api';
import DemoBanner from '../../components/DemoBanner';
import LoadingState from '../../components/LoadingState';

export default function DemoDetail() {
    const { ncoCode } = useParams();
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

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
                <DemoBanner />
                <div className="page">
                    <LoadingState message="Loading occupation details..." />
                </div>
            </div>
        );
    }

    if (error || !occupation) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
                <DemoBanner />
                <div className="page">
                    <div className="container-md">
                        <div className="card" style={{ textAlign: 'center' }}>
                            <p className="text-red-600 font-medium mb-4">
                                {error || 'Occupation not found'}
                            </p>
                            <Link to="/" className="btn btn-primary" style={{ display: 'inline-block' }}>
                                ← Back to Demo Search
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <DemoBanner />

            <div className="page">
                <div className="container-md">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link to="/" className="text-blue-600 font-medium" style={{ textDecoration: 'none' }}>
                            ← Back to Demo Search
                        </Link>
                    </div>

                    {/* Demo Notice */}
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <p className="text-sm" style={{ color: '#92400e' }}>
                            📌 This page is for demonstration only. No actions can be performed in demo mode.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="card">
                        {/* Header */}
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
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
                            <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.5rem' }}>
                                <div>
                                    {occupation.hierarchy?.map((level, idx) => (
                                        <div key={idx} className="flex items-center text-gray-700" style={{ marginBottom: '0.5rem' }}>
                                            <span style={{ color: 'var(--text-tertiary)', marginRight: '0.5rem' }}>
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
                                            to={`/occupation/${related.ncoCode}`}
                                            style={{
                                                display: 'block',
                                                padding: '1rem',
                                                backgroundColor: 'var(--bg-tertiary)',
                                                borderRadius: '0.5rem',
                                                border: '1px solid var(--border-color)',
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#eff6ff';
                                                e.currentTarget.style.borderColor = '#93c5fd';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                                                e.currentTarget.style.borderColor = 'var(--border-color)';
                                            }}
                                        >
                                            <p className="font-medium text-gray-900">{related.title}</p>
                                            <p className="text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>{related.ncoCode}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back Button */}
                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                            <Link to="/" className="btn btn-secondary">
                                ← Back to Demo Search
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
