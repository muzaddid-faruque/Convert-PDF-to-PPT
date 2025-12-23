import './DownloadButton.css';

export default function DownloadButton({ onDownload, disabled, fileSize }) {
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="download-section fade-in">
            <div className="download-card card">
                <div className="download-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h3 className="download-title">Conversion Complete!</h3>
                <p className="download-subtitle text-secondary">
                    Your PowerPoint presentation is ready to download
                </p>

                {fileSize && (
                    <p className="download-size text-sm text-secondary">
                        Estimated size: {formatFileSize(fileSize)}
                    </p>
                )}

                <button
                    className="btn btn-primary download-btn"
                    onClick={onDownload}
                    disabled={disabled}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PowerPoint
                </button>
            </div>
        </div>
    );
}
