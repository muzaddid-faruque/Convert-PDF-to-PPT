import { useState } from 'react';
import './ConversionSettings.css';

export default function ConversionSettings({ settings, onSettingsChange, pageCount }) {
    const [localSettings, setLocalSettings] = useState(settings);

    const handleChange = (key, value) => {
        const newSettings = { ...localSettings, [key]: value };
        setLocalSettings(newSettings);
        onSettingsChange(newSettings);
    };

    const qualityLabels = {
        1: 'Standard',
        2: 'High',
        3: 'Very High'
    };

    return (
        <div className="conversion-settings card fade-in">
            <h3 className="settings-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Conversion Settings
            </h3>

            <div className="settings-grid">
                {/* Slide Size */}
                <div className="setting-item">
                    <label className="setting-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                        Slide Size
                    </label>
                    <select
                        value={localSettings.slideSize}
                        onChange={(e) => handleChange('slideSize', e.target.value)}
                    >
                        <option value="16:9">16:9 (Widescreen)</option>
                        <option value="4:3">4:3 (Standard)</option>
                        <option value="A4">A4 Paper</option>
                        <option value="Letter">Letter</option>
                    </select>
                </div>

                {/* Image Quality */}
                <div className="setting-item">
                    <label className="setting-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Image Quality
                    </label>
                    <div className="quality-selector">
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="1"
                            value={localSettings.quality}
                            onChange={(e) => handleChange('quality', parseInt(e.target.value))}
                        />
                        <span className="quality-label">{qualityLabels[localSettings.quality]}</span>
                    </div>
                </div>

                {/* Fit Mode */}
                <div className="setting-item">
                    <label className="setting-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        Fit Mode
                    </label>
                    <select
                        value={localSettings.fitMode}
                        onChange={(e) => handleChange('fitMode', e.target.value)}
                    >
                        <option value="fit">Fit to Slide</option>
                        <option value="fill">Fill Slide</option>
                        <option value="original">Original Size</option>
                    </select>
                </div>

                {/* Page Range */}
                <div className="setting-item">
                    <label className="setting-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Page Range
                    </label>
                    <select
                        value={localSettings.pageRange}
                        onChange={(e) => handleChange('pageRange', e.target.value)}
                    >
                        <option value="all">All Pages ({pageCount})</option>
                        <option value="range">Custom Range</option>
                    </select>
                </div>

                {/* Custom Range Inputs */}
                {localSettings.pageRange === 'range' && (
                    <div className="setting-item range-inputs">
                        <div className="range-input-group">
                            <label className="text-sm text-secondary">From</label>
                            <input
                                type="number"
                                min="1"
                                max={pageCount}
                                value={localSettings.startPage || 1}
                                onChange={(e) => handleChange('startPage', parseInt(e.target.value))}
                                className="range-input"
                            />
                        </div>
                        <div className="range-input-group">
                            <label className="text-sm text-secondary">To</label>
                            <input
                                type="number"
                                min="1"
                                max={pageCount}
                                value={localSettings.endPage || pageCount}
                                onChange={(e) => handleChange('endPage', parseInt(e.target.value))}
                                className="range-input"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="settings-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-secondary">
                    All processing happens in your browser. Your files never leave your device.
                </span>
            </div>
        </div>
    );
}
