export function LogsView({ logs }) {
    return (
        <div className="logs-view">
            <h3>Logs</h3>
            {logs && logs.length > 0 ? (
                <ul className="log-list">
                    {logs.map((log, index) => (
                        <li key={index} className="log-item">
                            <span className="log-message">{log}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay logs disponibles.</p>
            )}
        </div>
    );
}