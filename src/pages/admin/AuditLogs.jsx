import { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/api';
import LoadingState from '../../components/LoadingState';

const ACTION_TYPES = ['ALL', 'SEARCH', 'SELECTION', 'OVERRIDE', 'SYNONYM_ADD', 'SYNONYM_REMOVE'];

export default function AuditLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadLogs();
    }, [filter]);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await getAuditLogs(filter);
            setLogs(data);
        } catch (error) {
            console.error('Failed to load audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'medium',
        });
    };

    const getActionBadgeClass = (action) => {
        const badgeMap = {
            SEARCH: 'badge-blue',
            SELECTION: 'badge-green',
            OVERRIDE: 'badge-purple',
            SYNONYM_ADD: 'badge-yellow',
            SYNONYM_REMOVE: 'badge-red',
        };
        return `badge ${badgeMap[action] || 'badge-gray'}`;
    };

    if (loading) {
        return (
            <div className="page">
                <LoadingState message="Loading audit logs..." />
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-container">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Audit Logs
                    </h1>

                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">
                            Filter by Action:
                        </label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="select-field"
                            style={{ width: 'auto' }}
                        >
                            {ACTION_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type === 'ALL' ? 'All Actions' : type.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    {logs.length === 0 ? (
                        <p className="text-gray-600" style={{ textAlign: 'center', padding: '2rem' }}>
                            No audit logs found for the selected filter.
                        </p>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>Action</th>
                                        <th>User</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="text-sm text-gray-600">
                                                {formatTimestamp(log.timestamp)}
                                            </td>
                                            <td>
                                                <span className={getActionBadgeClass(log.action)}>
                                                    {log.action.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="text-sm text-gray-900 font-medium">
                                                {log.user}
                                            </td>
                                            <td className="text-sm text-gray-700">
                                                {log.details}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {logs.length} log{logs.length !== 1 ? 's' : ''}
                    {filter !== 'ALL' && ` (filtered by ${filter.replace('_', ' ')})`}
                </div>
            </div>
        </div>
    );
}
