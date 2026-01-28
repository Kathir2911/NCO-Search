import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useRole, ROLES } from '../context/RoleContext';
import { requestOTP, verifyOTP, loginAdmin, verifyAdminOTP } from '../services/api';
import '../styles/Login.css';

export default function Login() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useRole();
    const roleParam = searchParams.get('role') || 'enumerator';
    const role = roleParam.toUpperCase();

    // UI States
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');

    // Reset state when role changes
    useEffect(() => {
        setStep(1);
        setError('');
        setPhone('');
        setUsername('');
        setPassword('');
        setOtp('');
    }, [role]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (role === ROLES.ENUMERATOR) {
                if (!phone) throw new Error('Phone number is required');
                await requestOTP(phone);
                setStep(2);
            } else if (role === ROLES.ADMIN) {
                if (!username || !password) throw new Error('Username and password are required');
                await loginAdmin(username, password);
                setStep(2);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let userData;
            if (role === ROLES.ENUMERATOR) {
                userData = await verifyOTP(phone, otp);
            } else if (role === ROLES.ADMIN) {
                userData = await verifyAdminOTP(username, otp);
            }

            login(userData);

            // Navigate based on role
            if (role === ROLES.ADMIN) {
                navigate('/admin/dashboard');
            } else {
                navigate('/enumerator');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const roleDisplay = roleParam.charAt(0).toUpperCase() + roleParam.slice(1);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-logo">
                    <div className="logo-badge-large">NCO</div>
                </div>

                <h1 className="login-title">NCO Search System</h1>
                <h2 className="login-subtitle">{roleDisplay} Login</h2>

                {error && (
                    <div className="error-box" style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP}>
                        {role === ROLES.ENUMERATOR ? (
                            <div className="mb-4">
                                <label className="label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="e.g., 9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                    We will send a one-time password (OTP) to this number via Twilio.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <label className="label">Username</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="label">Password</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Processing...' : role === ROLES.ENUMERATOR ? 'Request OTP' : 'Login'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <div className="mb-4">
                            <label className="label">Enter {role === ROLES.ENUMERATOR ? 'OTP' : 'Security Code'}</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="6-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                {role === ROLES.ENUMERATOR
                                    ? `Sent to ${phone}`
                                    : 'Please enter your secondary verification code.'}
                            </p>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline"
                            style={{ width: '100%', marginTop: '0.75rem' }}
                            onClick={() => setStep(1)}
                            disabled={loading}
                        >
                            Back
                        </button>
                    </form>
                )}

                <div className="login-actions" style={{ marginTop: '2rem' }}>
                    <Link to="/" className="btn-back">
                        ← Back to Get Started
                    </Link>
                </div>

                <div className="login-footer">
                    <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                        By logging in, you agree to comply with government data security guidelines.
                    </p>
                </div>
            </div>
        </div>
    );
}
