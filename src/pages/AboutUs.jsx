import React from 'react';

export default function AboutUs() {
    return (
        <div className="page">
            <div className="container-md">
                <div className="card">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6" style={{ borderBottom: '3px solid var(--accent-yellow)', display: 'inline-block', paddingBottom: '0.5rem' }}>
                        About NCO Search
                    </h1>

                    <div className="text-lg text-gray-700 mb-6">
                        <p className="mb-4">
                            The National Classification of Occupations (NCO) Search platform is a professional tool designed to streamline the identification and classification of various job roles within the national economic framework.
                        </p>
                        <p className="mb-4">
                            Our mission is to provide an efficient, AI-enabled semantic search experience that helps enumerators, government officials, and the public accurately map job titles to their respective NCO codes.
                        </p>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Core Objectives</h2>
                    <ul className="mb-8" style={{ listStyle: 'none', padding: 0 }}>
                        {[
                            'Provide high-accuracy semantic matching for occupational titles.',
                            'Maintain a comprehensive database of NCO classifications.',
                            'Offer a user-friendly interface for different administrative roles.',
                            'Ensure transparency through detailed audit logging and analytics.'
                        ].map((item, index) => (
                            <li key={index} className="mb-3 flex items-center gap-3">
                                <span style={{ color: 'var(--bg-accent)', fontWeight: 'bold' }}>•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="match-reason" style={{ backgroundColor: 'var(--bg-tertiary)', border: 'none' }}>
                        <p className="font-semibold text-gray-900 mb-2">Government Compliance</p>
                        <p className="text-sm text-gray-700">
                            This platform adheres to the latest national standards for occupational classification and is maintained by the central administration for official enumeration and statistical purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
