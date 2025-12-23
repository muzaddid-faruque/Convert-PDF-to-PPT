import { useState } from 'react';
import './PreviewPanel.css';

export default function PreviewPanel({ file, pageCount }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="preview-panel card fade-in">
            <div className="preview-header">
                <h3 className="preview-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF Preview
                </h3>
                <button
                    className="btn-secondary"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>

            <div className={`preview-content ${isExpanded ? 'expanded' : ''}`}>
                <div className="file-info">
                    <div className="file-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="file-details">
                        <h4 className="file-name">{file.name}</h4>
                        <div className="file-meta">
                            <span className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                            </span>
                            <span className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                {formatFileSize(file.size)}
                            </span>
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="preview-info slide-in">
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">File Type</span>
                                <span className="info-value">PDF Document</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Total Pages</span>
                                <span className="info-value">{pageCount}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">File Size</span>
                                <span className="info-value">{formatFileSize(file.size)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Output Format</span>
                                <span className="info-value">PowerPoint (.pptx)</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
