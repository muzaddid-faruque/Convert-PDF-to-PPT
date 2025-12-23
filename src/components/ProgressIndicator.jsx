import './ProgressIndicator.css';

export default function ProgressIndicator({ progress }) {
    const { current, total, percentage, currentPage, status } = progress;

    return (
        <div className="progress-indicator card fade-in">
            <div className="progress-header">
                <h3 className="progress-title">
                    <div className="spinner"></div>
                    Converting PDF to PowerPoint
                </h3>
                <span className="progress-percentage">{percentage}%</span>
            </div>

            <div className="progress-bar">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            <div className="progress-details">
                <div className="progress-stat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Page {current} of {total}</span>
                </div>

                {currentPage && (
                    <div className="progress-stat">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Processing page {currentPage}</span>
                    </div>
                )}
            </div>

            {status && (
                <p className="progress-status text-sm text-secondary">
                    {status}
                </p>
            )}
        </div>
    );
}
