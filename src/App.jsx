import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ConversionSettings from './components/ConversionSettings';
import ProgressIndicator from './components/ProgressIndicator';
import PreviewPanel from './components/PreviewPanel';
import DownloadButton from './components/DownloadButton';
import { loadPDF, getPageCount, extractAllPages } from './utils/pdfProcessor';
import { generatePPT, estimateFileSize } from './utils/pptGenerator';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [pageCount, setPageCount] = useState(0);
    const [settings, setSettings] = useState({
        slideSize: '16:9',
        quality: 2,
        fitMode: 'fit',
        pageRange: 'all',
        startPage: 1,
        endPage: null
    });
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(null);
    const [images, setImages] = useState(null);
    const [estimatedSize, setEstimatedSize] = useState(0);
    const [error, setError] = useState('');

    const handleFileSelect = async (selectedFile) => {
        setFile(selectedFile);
        setError('');
        setImages(null);
        setProgress(null);

        try {
            const pdf = await loadPDF(selectedFile);
            setPdfData(pdf);
            const count = getPageCount(pdf);
            setPageCount(count);
            setSettings(prev => ({ ...prev, endPage: count }));
        } catch (err) {
            setError('Failed to load PDF. Please try another file.');
            console.error('PDF loading error:', err);
        }
    };

    const handleConvert = async () => {
        if (!pdfData) return;

        setProcessing(true);
        setError('');
        setProgress({ current: 0, total: pageCount, percentage: 0, status: 'Starting conversion...' });

        try {
            // Extract pages as images
            const extractedImages = await extractAllPages(pdfData, settings, (progressData) => {
                setProgress({
                    ...progressData,
                    status: `Processing page ${progressData.currentPage}...`
                });
            });

            setImages(extractedImages);
            const size = estimateFileSize(extractedImages);
            setEstimatedSize(size);

            setProgress({
                current: extractedImages.length,
                total: extractedImages.length,
                percentage: 100,
                status: 'Conversion complete!'
            });
        } catch (err) {
            setError('Conversion failed. Please try again.');
            console.error('Conversion error:', err);
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = async () => {
        if (!images) return;

        try {
            const filename = file.name.replace('.pdf', '');
            await generatePPT(images, settings, filename);
        } catch (err) {
            setError('Download failed. Please try again.');
            console.error('Download error:', err);
        }
    };

    const handleReset = () => {
        setFile(null);
        setPdfData(null);
        setPageCount(0);
        setImages(null);
        setProgress(null);
        setProcessing(false);
        setError('');
        setSettings({
            slideSize: '16:9',
            quality: 2,
            fitMode: 'fit',
            pageRange: 'all',
            startPage: 1,
            endPage: null
        });
    };

    return (
        <div className="app">
            <div className="container">
                {/* Header */}
                <header className="app-header fade-in">
                    <div className="header-content">
                        <div className="logo">
                            <svg width="48" height="48" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
                                        <stop offset="100%" style={{ stopColor: '#3B82F6' }} />
                                    </linearGradient>
                                </defs>
                                <rect width="100" height="100" rx="20" fill="url(#logoGrad)" />
                                <path d="M30 25 L70 25 L70 45 L30 45 Z" fill="white" opacity="0.9" />
                                <path d="M30 50 L70 50 L70 70 L30 70 Z" fill="white" opacity="0.7" />
                                <circle cx="75" cy="75" r="15" fill="#10B981" />
                                <path d="M70 75 L73 78 L80 70" stroke="white" strokeWidth="2" fill="none" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="app-title gradient-text">PDF to PPT Converter</h1>
                            <p className="app-subtitle text-secondary">
                                Convert PDF files to PowerPoint presentations instantly
                            </p>
                        </div>
                    </div>
                    <div className="header-badges">
                        <span className="badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            100% Private
                        </span>
                        <span className="badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Fast & Free
                        </span>
                    </div>
                </header>

                {/* Main Content */}
                {!file && (
                    <FileUpload onFileSelect={handleFileSelect} />
                )}

                {file && !images && (
                    <>
                        <PreviewPanel file={file} pageCount={pageCount} />
                        <ConversionSettings
                            settings={settings}
                            onSettingsChange={setSettings}
                            pageCount={pageCount}
                        />

                        <div className="action-buttons fade-in">
                            <button
                                className="btn btn-primary"
                                onClick={handleConvert}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Start Conversion
                                    </>
                                )}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleReset}
                                disabled={processing}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}

                {processing && progress && (
                    <ProgressIndicator progress={progress} />
                )}

                {images && !processing && (
                    <>
                        <DownloadButton
                            onDownload={handleDownload}
                            fileSize={estimatedSize}
                        />
                        <div className="action-buttons fade-in">
                            <button className="btn btn-secondary" onClick={handleReset}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Convert Another PDF
                            </button>
                        </div>
                    </>
                )}

                {error && (
                    <div className="error-banner fade-in">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Footer */}
                <footer className="app-footer">
                    <p className="text-sm text-secondary text-center">
                        All processing happens in your browser. Your files never leave your device.
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default App;
