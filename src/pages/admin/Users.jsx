import { useState, useEffect } from 'react';
import { getUsers, registerUser, deleteUser, toggleUserStatus } from '../../services/api';
import LoadingState from '../../components/LoadingState';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        role: 'ENUMERATOR'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            // Only show enumerators (filter out admins for safety)
            const enumerators = Array.isArray(data) ? data.filter(u => u.role !== 'ADMIN') : [];
            setUsers(enumerators);
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Could not connect to database. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            if (!formData.name || !formData.phone) {
                throw new Error('Name and Phone are required');
            }

            if (!/^\d{10}$/.test(formData.phone)) {
                throw new Error('Phone number must be exactly 10 digits');
            }

            await registerUser(formData);
            setSuccess(`Enumerator ${formData.name} registered successfully!`);
            setFormData({ name: '', phone: '', role: 'ENUMERATOR' });
            loadUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (phone, name) => {
        if (!window.confirm(`Are you sure you want to delete enumerator "${name}" (${phone})?\nThis action cannot be undone.`)) {
            return;
        }

        try {
            await deleteUser(phone);
            setSuccess(`User ${name} removed successfully`);
            loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleStatus = async (phone) => {
        try {
            await toggleUserStatus(phone);
            loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <LoadingState message="Connecting to server..." />;
    }

    return (
        <div className="page">
            <div className="page-container">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Manage Enumerators
                    </h1>
                    <button onClick={loadUsers} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Refresh List
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Registration Form */}
                    <div className="lg:col-span-3">
                        <div className="card shadow-sm" style={{ position: 'sticky', top: '20px' }}>
                            <h2 className="text-xl font-semibold mb-4">Add New</h2>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-100">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="input-field"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="input-field"
                                        placeholder="10-digit number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">LoginID for OTP login</p>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Processing...' : 'Register User'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="lg:col-span-9">
                        <div className="card shadow-md">
                            <h2 className="text-xl font-semibold mb-6">Registered Database</h2>

                            {users.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400">No enumerators found in database.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left" style={{ borderCollapse: 'separate', borderSpacing: '0 10px', minWidth: '900px', tableLayout: 'fixed' }}>
                                        <thead>
                                            <tr className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                                                <th className="px-6" style={{ width: '30%' }}>Enumerator Info</th>
                                                <th className="px-6" style={{ width: '25%' }}>Contact</th>
                                                <th className="px-6 text-center" style={{ width: '25%' }}>Security Status</th>
                                                <th className="px-6 text-right" style={{ width: '20%' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user) => (
                                                <tr key={user._id || user.phone} className="group bg-white hover:bg-blue-50/30 transition-all duration-200">
                                                    <td className="py-4 px-6 border-y border-l rounded-l-xl border-gray-100">
                                                        <div className="font-bold text-gray-900">{user.name}</div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Initial Setup'}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 border-y border-gray-100">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded w-fit">
                                                                {user.phone}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 mt-1">
                                                                Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 border-y border-gray-100 text-center">
                                                        <button
                                                            onClick={() => handleToggleStatus(user.phone)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${user.isActive !== false
                                                                ? 'bg-green-100 text-green-700 hover:bg-yellow-100 hover:text-yellow-700'
                                                                : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'
                                                                }`}
                                                            title="Toggle User Access"
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                            {user.isActive !== false ? 'Access Granted' : 'Access Revoked'}
                                                        </button>
                                                    </td>
                                                    <td className="py-4 px-6 border-y border-r rounded-r-xl border-gray-100 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleDelete(user.phone, user.name)}
                                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Remove User Permanently"
                                                            >
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
