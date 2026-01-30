import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics } from '../../services/api';
import LoadingState from '../../components/LoadingState';

export default function Dashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const data = await getAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <LoadingState message="Loading analytics..." />
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-container">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Admin Dashboard
                </h1>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {/* Total Searches */}
                    <div className="card stat-card">
                        <div>
                            <p className="stat-label">Total Searches</p>
                            <p className="stat-value">
                                {analytics?.totalSearches?.toLocaleString()}
                            </p>
                        </div>
                        <div className="stat-icon"></div>
                    </div>

                    {/* Average Confidence */}
                    <div className="card stat-card">
                        <div>
                            <p className="stat-label">Avg. Confidence</p>
                            <p className="stat-value" style={{ color: '#10b981' }}>
                                {analytics?.averageConfidence
                                    ? Math.round(analytics.averageConfidence * 100) + '%'
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className="stat-icon"></div>
                    </div>

                    {/* Low Confidence Cases */}
                    <div className="card stat-card">
                        <div>
                            <p className="stat-label">Low Confidence</p>
                            <p className="stat-value" style={{ color: '#f59e0b' }}>
                                {analytics?.lowConfidenceCases?.toLocaleString()}
                            </p>
                        </div>
                        <div className="stat-icon"></div>
                    </div>

                    {/* Total Enumerators */}
                    <div className="card stat-card">
                        <div>
                            <p className="stat-label">Total Enumerators</p>
                            <p className="stat-value" style={{ color: '#6366f1' }}>
                                {analytics?.totalEnumerators?.toLocaleString() || '24'}
                            </p>
                        </div>
                        <div className="stat-icon"></div>
                    </div>
                </div>

                {/* Top Occupations */}
                <div className="card mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Most Searched Occupations
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {analytics?.topOccupations?.map((occ, idx) => (
                            <div
                                key={occ.ncoCode}
                                className="top-occupation-item flex items-center justify-between"
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold" style={{ color: 'var(--text-tertiary)' }}>
                                        #{idx + 1}
                                    </span>
                                    <div>
                                        <p className="occupation-title font-medium">{occ.title}</p>
                                        <p className="occupation-subtitle text-sm" style={{ fontFamily: 'monospace' }}>{occ.ncoCode}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p className="text-xl font-bold text-blue-600">
                                        {occ.count.toLocaleString()}
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>searches</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/admin/synonyms"
                        className="card"
                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    >
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Manage Synonyms
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Add or remove synonym mappings for better search results
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/audit-logs"
                        className="card"
                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    >
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    View Audit Logs
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Review system activity and user interactions
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="card"
                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    >
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Manage Enumerators
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Register new enumerators and manage their access
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
