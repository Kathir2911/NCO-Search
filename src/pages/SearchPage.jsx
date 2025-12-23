import { useState } from 'react';
import SearchBox from '../components/SearchBox';
import ResultCard from '../components/ResultCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { searchOccupations } from '../services/api';

export default function SearchPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [lastQuery, setLastQuery] = useState('');

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

    const handleResultAction = (action, result) => {
        console.log(`${action} action for:`, result.ncoCode);
    };

    return (
        <div className="page">
            <div className="container-md">
                {/* Search Section */}
                <div className="card mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Search NCO Occupations
                    </h2>
                    <SearchBox onSearch={handleSearch} loading={loading} />
                </div>

                {/* Results Section */}
                {loading && <LoadingState message="Searching occupations..." />}

                {!loading && searched && results.length === 0 && (
                    <EmptyState
                        title="No Results Found"
                        message={`No occupations found matching "${lastQuery}". Try describing the job role in more detail or use different keywords.`}
                        icon="📭"
                    />
                )}

                {!loading && results.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Found {results.length} matching occupation{results.length !== 1 ? 's' : ''}
                        </h3>
                        {results.map((result) => (
                            <ResultCard
                                key={result.ncoCode}
                                result={result}
                                onAction={handleResultAction}
                            />
                        ))}
                    </div>
                )}

                {!loading && !searched && (
                    <EmptyState
                        title="Start Your Search"
                        message="Enter a job title or description above to find matching NCO occupations using AI-powered semantic search."
                        icon="🔍"
                    />
                )}
            </div>
        </div>
    );
}
