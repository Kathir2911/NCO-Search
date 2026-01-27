import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchOccupations } from '../../services/api';
import DemoBanner from '../../components/DemoBanner';
import DemoExplanation from '../../components/DemoExplanation';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import SearchBox from '../../components/SearchBox';

export default function DemoSearch() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [lastQuery, setLastQuery] = useState('');

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSearch = async (query) => {
        setLoading(true);
        setSearched(true);
        setLastQuery(query);

        try {
            const data = await searchOccupations(query);
            setResults(data);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <DemoBanner />

            <div className="page">
                <div className="container-md">
                    {/* Search Section */}
                    <div className="card mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Search NCO Occupations (Demo)
                        </h2>
                        <SearchBox onSearch={handleSearch} loading={loading} />
                    </div>

                    {/* Explanation Panel */}
                    <DemoExplanation />

                    {/* Results Section */}
                    {loading && <LoadingState message="Searching occupations..." />}

                    {!loading && searched && results.length === 0 && (
                        <EmptyState
                            title="No Results Found"
                            message={`No occupations found matching "${lastQuery}". Try describing the job role in more detail or use different keywords.`}
                            icon="📭"
                        />
                    )
                    }

                    {
                        !loading && results.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    border: '1px solid #93c5fd'
                                }}>
                                    <p className="text-sm" style={{ color: '#1e40af' }}>
                                        ℹ️ This is a demonstration of AI-based occupation mapping. Found {results.length} matching occupation{results.length !== 1 ? 's' : ''}.
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {results.map((result) => (
                                        <div key={result.ncoCode} className="card">
                                            {/* Occupation Title */}
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {result.title}
                                            </h3>

                                            {/* NCO Code */}
                                            <p className="text-sm mb-3" style={{
                                                fontFamily: 'monospace',
                                                color: '#2563eb',
                                                fontWeight: 500
                                            }}>
                                                NCO Code: {result.ncoCode}
                                            </p>

                                            {/* Short Description */}
                                            <p className="text-sm text-gray-700 mb-4" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {result.description}
                                            </p>

                                            {/* View Details Link */}
                                            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                                                <Link
                                                    to={`/demo/occupation/${result.ncoCode}`}
                                                    className="text-sm font-medium"
                                                    style={{ color: '#2563eb', textDecoration: 'none' }}
                                                >
                                                    View Details →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    {
                        !loading && !searched && (
                            <EmptyState
                                title="Public Demo Mode"
                                message="Enter a job description above to see how AI maps it to NCO occupation codes."
                                icon="👁️"
                            />
                        )
                    }
                </div >
            </div >
        </div >
    );
}
