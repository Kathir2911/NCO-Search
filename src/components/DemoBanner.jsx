export default function DemoBanner() {
    return (
        <div style={{
            backgroundColor: '#fef3c7',
            borderBottom: '2px solid #f59e0b',
            padding: '1rem',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}>
                <span style={{ fontSize: '1.5rem' }}>👁️</span>
                <span style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#92400e'
                }}>
                    Public Demo – Read Only Mode
                </span>
            </div>
        </div>
    );
}
