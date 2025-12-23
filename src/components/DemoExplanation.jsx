export default function DemoExplanation() {
    return (
        <div className="card" style={{ backgroundColor: '#eff6ff', borderColor: '#93c5fd' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e40af' }}>
                🔍 How the System Works
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}>
                        1
                    </div>
                    <div>
                        <h4 className="font-semibold" style={{ color: '#1e40af', marginBottom: '0.25rem' }}>
                            Enter Job Description
                        </h4>
                        <p className="text-sm" style={{ color: '#1e40af' }}>
                            User enters a detailed job title or occupation description in their own words.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}>
                        2
                    </div>
                    <div>
                        <h4 className="font-semibold" style={{ color: '#1e40af', marginBottom: '0.25rem' }}>
                            AI Performs Semantic Analysis
                        </h4>
                        <p className="text-sm" style={{ color: '#1e40af' }}>
                            Advanced AI algorithms analyze the meaning and context of the job description.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        flexShrink: 0
                    }}>
                        3
                    </div>
                    <div>
                        <h4 className="font-semibold" style={{ color: '#1e40af', marginBottom: '0.25rem' }}>
                            Maps to NCO Categories
                        </h4>
                        <p className="text-sm" style={{ color: '#1e40af' }}>
                            System matches the description to standardized NCO occupation codes with explanations.
                        </p>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                borderLeft: '4px solid #2563eb'
            }}>
                <p className="text-sm" style={{ color: '#1e40af', fontStyle: 'italic' }}>
                    💡 This demonstration shows how AI can help classify occupations according to the National Classification of Occupations (NCO) standard.
                </p>
            </div>
        </div>
    );
}
