export default function EmptyState({ title, message, icon = '🔍' }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <h3 className="empty-title">{title}</h3>
            <p className="empty-message">{message}</p>
        </div>
    );
}
