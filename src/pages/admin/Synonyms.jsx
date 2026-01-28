import { useState, useEffect } from 'react';
import { getSynonyms, addSynonym, removeSynonym } from '../../services/api';
import LoadingState from '../../components/LoadingState';

export default function Synonyms() {
    const [synonyms, setSynonyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newSynonym, setNewSynonym] = useState({
        synonym: '',
        ncoCode: '',
        occupation: '',
    });

    useEffect(() => {
        loadSynonyms();
    }, []);

    const loadSynonyms = async () => {
        setLoading(true);
        try {
            const data = await getSynonyms();
            setSynonyms(data);
        } catch (error) {
            console.error('Failed to load synonyms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSynonym = async (e) => {
        e.preventDefault();
        if (!newSynonym.synonym || !newSynonym.ncoCode || !newSynonym.occupation) {
            alert('Please fill in all fields');
            return;
        }

        setAdding(true);
        try {
            await addSynonym(newSynonym.synonym, newSynonym.ncoCode, newSynonym.occupation);
            setNewSynonym({ synonym: '', ncoCode: '', occupation: '' });
            await loadSynonyms();
        } catch (error) {
            console.error('Failed to add synonym:', error);
            alert('Failed to add synonym');
        } finally {
            setAdding(false);
        }
    };

    const handleRemoveSynonym = async (synonymId) => {
        if (!confirm('Are you sure you want to remove this synonym?')) {
            return;
        }

        try {
            await removeSynonym(synonymId);
            await loadSynonyms();
        } catch (error) {
            console.error('Failed to remove synonym:', error);
            alert('Failed to remove synonym');
        }
    };

    if (loading) {
        return (
            <div className="page">
                <LoadingState message="Loading synonyms..." />
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Synonym Manager
                </h1>

                {/* Add New Synonym Form */}
                <div className="card mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Add New Synonym
                    </h2>
                    <form onSubmit={handleAddSynonym}>
                        <div className="mb-4">
                            <label className="label">
                                Synonym Text
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g., cab driver, seamstress"
                                value={newSynonym.synonym}
                                onChange={(e) => setNewSynonym({ ...newSynonym, synonym: e.target.value })}
                                disabled={adding}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="label">
                                    NCO Code
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., 83210102"
                                    value={newSynonym.ncoCode}
                                    onChange={(e) => setNewSynonym({ ...newSynonym, ncoCode: e.target.value })}
                                    disabled={adding}
                                />
                            </div>

                            <div>
                                <label className="label">
                                    Occupation Title
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g., Taxi Driver"
                                    value={newSynonym.occupation}
                                    onChange={(e) => setNewSynonym({ ...newSynonym, occupation: e.target.value })}
                                    disabled={adding}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={adding}
                            >
                                {adding ? 'Adding...' : 'Add Synonym'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Synonyms List */}
                <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Existing Synonyms ({synonyms.length})
                    </h2>

                    {synonyms.length === 0 ? (
                        <p className="text-gray-600" style={{ textAlign: 'center', padding: '2rem 0' }}>
                            No synonyms added yet. Add your first synonym above.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {synonyms.map((syn) => (
                                <div
                                    key={syn.id}
                                    className="synonym-item flex items-center justify-between"
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border-color)'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="synonym-text font-semibold">
                                                "{syn.synonym}"
                                            </span>
                                            <span style={{ color: 'var(--text-tertiary)' }}>→</span>
                                            <span className="nco-code" style={{ fontFamily: 'monospace', fontWeight: 500 }}>
                                                {syn.ncoCode}
                                            </span>
                                        </div>
                                        <p className="synonym-occupation text-sm">{syn.occupation}</p>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveSynonym(syn.id)}
                                        className="remove-btn"
                                        style={{
                                            marginLeft: '1rem',
                                            padding: '0.25rem 0.75rem',
                                            fontSize: '0.875rem',
                                            color: '#dc2626',
                                            background: 'none',
                                            border: 'none',
                                            borderRadius: '0.25rem',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
