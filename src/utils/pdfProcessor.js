import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up the worker using local file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Load a PDF file
 * @param {File} file - The PDF file to load
 * @returns {Promise<Object>} PDF document object
 */
export async function loadPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    return await loadingTask.promise;
}

/**
 * Get the number of pages in a PDF
 * @param {Object} pdf - PDF document object
 * @returns {number} Number of pages
 */
export function getPageCount(pdf) {
    return pdf.numPages;
}

/**
 * Render a PDF page to an image
 * @param {Object} page - PDF page object
 * @param {number} scale - Scale factor for rendering (1 = 72dpi, 2 = 144dpi, etc.)
 * @param {string} format - Image format ('png' or 'jpeg')
 * @returns {Promise<Object>} Object containing image data URL, width, and height
 */
export async function renderPageToImage(page, scale = 2, format = 'png') {
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to blob
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpeg' ? 0.95 : undefined;

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({
                    dataUrl: reader.result,
                    width: viewport.width,
                    height: viewport.height,
                    blob: blob
                });
            };
            reader.readAsDataURL(blob);
        }, mimeType, quality);
    });
}

/**
 * Extract all pages from a PDF as images
 * @param {Object} pdf - PDF document object
 * @param {Object} settings - Conversion settings
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Array>} Array of image objects
 */
export async function extractAllPages(pdf, settings, onProgress) {
    const { quality = 2, pageRange = 'all', startPage = 1, endPage = null } = settings;
    const totalPages = pdf.numPages;
    const images = [];

    // Determine which pages to process
    let pagesToProcess = [];
    if (pageRange === 'all') {
        pagesToProcess = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (pageRange === 'range') {
        const start = Math.max(1, startPage);
        const end = Math.min(totalPages, endPage || totalPages);
        pagesToProcess = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    // Process each page
    for (let i = 0; i < pagesToProcess.length; i++) {
        const pageNum = pagesToProcess[i];
        const page = await pdf.getPage(pageNum);
        const imageData = await renderPageToImage(page, quality, 'png');

        images.push({
            pageNumber: pageNum,
            ...imageData
        });

        // Report progress
        if (onProgress) {
            onProgress({
                current: i + 1,
                total: pagesToProcess.length,
                percentage: Math.round(((i + 1) / pagesToProcess.length) * 100),
                currentPage: pageNum
            });
        }
    }

    return images;
}

/**
 * Get PDF metadata
 * @param {Object} pdf - PDF document object
 * @returns {Promise<Object>} PDF metadata
 */
export async function getPDFMetadata(pdf) {
    const metadata = await pdf.getMetadata();
    return {
        numPages: pdf.numPages,
        info: metadata.info,
        metadata: metadata.metadata
    };
}
