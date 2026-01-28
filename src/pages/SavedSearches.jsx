import React from 'react';

export default function SavedSearches() {
    return (
        <div className="page">
            <div className="container-md">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ borderBottom: '3px solid var(--accent-yellow)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                        Saved Searches
                    </h1>

                    <div className="text-lg text-gray-700 mb-8">
                        <p>
                            This page allows you to quickly access previously performed occupational searches and their selected NCO codes.
                        </p>
                    </div>

                    <div className="empty-state" style={{ padding: '4rem 0', border: '2px dashed var(--border-color)', borderRadius: '0.5rem' }}>
                        <p className="text-xl font-semibold text-gray-900 mb-2">No Saved Searches Yet</p>
                        <p className="text-gray-600">Performed searches with "Save" enabled will appear here for quick reference.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
