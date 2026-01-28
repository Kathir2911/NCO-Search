import React from 'react';

export default function HowItWorks() {
    return (
        <div className="page">
            <div className="container-md">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ borderBottom: '3px solid var(--accent-yellow)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                        How It Works
                    </h1>

                    <div className="text-lg text-gray-700 mb-8">
                        <p>
                            The NCO Search platform utilizes advanced AI and semantic matching to bridge the gap between human job descriptions and formal classification codes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border-color)', margin: 0 }}>
                            <h3 className="text-xl font-semibold mb-3">1. Semantic Input</h3>
                            <p className="text-sm">Enter detailed job descriptions or titles. Our AI understands context and synonyms, not just exact keywords.</p>
                        </div>
                        <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border-color)', margin: 0 }}>
                            <h3 className="text-xl font-semibold mb-3">2. Vector Matching</h3>
                            <p className="text-sm">The system compares the input against thousands of NCO entries to find the most relevant mathematical matches.</p>
                        </div>
                        <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border-color)', margin: 0 }}>
                            <h3 className="text-xl font-semibold mb-3">3. Hierarchy Context</h3>
                            <p className="text-sm">Matches are presented within their NCO hierarchy, providing full context for accurate selection.</p>
                        </div>
                        <div className="card" style={{ boxShadow: 'none', border: '1px solid var(--border-color)', margin: 0 }}>
                            <h3 className="text-xl font-semibold mb-3">4. Human Validation</h3>
                            <p className="text-sm">Final selections by qualified enumerators ensure the highest level of data integrity for national statistics.</p>
                        </div>
                    </div>

                    <div className="match-reason" style={{ backgroundColor: 'var(--bg-tertiary)', border: 'none' }}>
                        <p className="font-semibold text-gray-900 mb-2">Transparency Note</p>
                        <p className="text-sm text-gray-700">
                            The Public Demo provides a showcase of this technology's capabilities. Note that for security and data control, administrative functions are restricted to authorized personnel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
