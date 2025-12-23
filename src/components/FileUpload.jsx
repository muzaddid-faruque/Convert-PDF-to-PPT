import { useState, useCallback } from 'react';
import './FileUpload.css';

export default function FileUpload({ onFileSelect }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    const validateFile = (file) => {
        setError('');

        // Check file type
        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return false;
        }

        // Check file size (50MB limit)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 50MB');
            return false;
        }

        return true;
    };

    const handleFile = (file) => {
        if (validateFile(file)) {
            onFileSelect(file);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    };

    return (
        <div className="file-upload-container fade-in">
            <div
                className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    type="file"
                    id="file-input"
                    accept=".pdf"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                />

                <div className="upload-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>

                <h3 className="upload-title">Drop your PDF here</h3>
                <p className="upload-subtitle">or click to browse</p>

                <label htmlFor="file-input" className="btn btn-primary mt-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Choose PDF File
                </label>

                <p className="upload-info text-secondary text-sm mt-2">
                    Maximum file size: 50MB
                </p>
            </div>

            {error && (
                <div className="error-message fade-in">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
}
