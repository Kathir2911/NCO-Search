import React from 'react';

export default function Guidelines() {
    return (
        <div className="page">
            <div className="container-md">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ borderBottom: '3px solid var(--accent-yellow)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                        NCO Classification Guidelines
                    </h1>

                    <div className="text-lg text-gray-700 mb-6">
                        <p className="mb-4">
                            These guidelines are intended for field enumerators to ensure consistent and accurate classification of occupations.
                        </p>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Steps for Enumerators</h2>
                    <ul className="mb-8" style={{ listStyle: 'none', padding: 0 }}>
                        {[
                            'Ask the respondent for their primary job title and main tasks.',
                            'Search for keywords in the NCO platform.',
                            'Review the hierarchy levels to ensure the match is appropriate.',
                            'If multiple codes seem relevant, select the one that most closely matches the daily tasks described.',
                            'Always use the specific code rather than a general category whenever possible.'
                        ].map((item, index) => (
                            <li key={index} className="mb-3 flex items-center gap-3">
                                <span style={{ color: 'var(--bg-accent)', fontWeight: 'bold' }}>•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="match-reason" style={{ backgroundColor: 'var(--bg-tertiary)', border: 'none' }}>
                        <p className="font-semibold text-gray-900 mb-2">Need Help?</p>
                        <p className="text-sm text-gray-700">
                            If you encounter an occupation that does not fit any existing category, please mark it for administrative review and provide a detailed description of the role.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
