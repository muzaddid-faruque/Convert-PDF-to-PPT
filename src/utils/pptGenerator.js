import pptxgen from 'pptxgenjs';
import { saveAs } from 'file-saver';

// Slide size presets (in inches)
const SLIDE_SIZES = {
    '16:9': { width: 10, height: 5.625 },
    '4:3': { width: 10, height: 7.5 },
    'A4': { width: 11.69, height: 8.27 },
    'Letter': { width: 11, height: 8.5 },
    'Custom': { width: 10, height: 5.625 }
};

/**
 * Create a new PowerPoint presentation
 * @param {string} slideSize - Slide size preset ('16:9', '4:3', 'A4', 'Letter')
 * @returns {Object} PptxGenJS presentation object
 */
export function createPresentation(slideSize = '16:9') {
    const pptx = new pptxgen();
    const size = SLIDE_SIZES[slideSize] || SLIDE_SIZES['16:9'];

    // Define custom layout first, then set it
    pptx.defineLayout({ name: 'CUSTOM', width: size.width, height: size.height });
    pptx.layout = 'CUSTOM';

    // Set presentation properties
    pptx.author = 'PDF to PPT Converter';
    pptx.company = 'PDF to PPT Converter';
    pptx.subject = 'Converted from PDF';
    pptx.title = 'PDF to PowerPoint';

    return pptx;
}

/**
 * Calculate image dimensions based on fit mode
 * @param {number} imgWidth - Original image width
 * @param {number} imgHeight - Original image height
 * @param {number} slideWidth - Slide width in inches
 * @param {number} slideHeight - Slide height in inches
 * @param {string} fitMode - Fit mode ('fit', 'fill', 'original')
 * @returns {Object} Calculated dimensions and position
 */
function calculateImageDimensions(imgWidth, imgHeight, slideWidth, slideHeight, fitMode) {
    const imgAspect = imgWidth / imgHeight;
    const slideAspect = slideWidth / slideHeight;

    let width, height, x, y;

    if (fitMode === 'fit') {
        // Fit image within slide, maintaining aspect ratio
        if (imgAspect > slideAspect) {
            width = slideWidth;
            height = slideWidth / imgAspect;
        } else {
            height = slideHeight;
            width = slideHeight * imgAspect;
        }
        x = (slideWidth - width) / 2;
        y = (slideHeight - height) / 2;
    } else if (fitMode === 'fill') {
        // Fill slide, may crop image
        if (imgAspect > slideAspect) {
            height = slideHeight;
            width = slideHeight * imgAspect;
        } else {
            width = slideWidth;
            height = slideWidth / imgAspect;
        }
        x = (slideWidth - width) / 2;
        y = (slideHeight - height) / 2;
    } else {
        // Original size (may exceed slide bounds)
        // Convert pixels to inches (assuming 96 DPI)
        width = imgWidth / 96;
        height = imgHeight / 96;
        x = (slideWidth - width) / 2;
        y = (slideHeight - height) / 2;
    }

    return { width, height, x, y };
}

/**
 * Add an image slide to the presentation
 * @param {Object} pptx - PptxGenJS presentation object
 * @param {Object} imageData - Image data object
 * @param {string} fitMode - Fit mode ('fit', 'fill', 'original')
 * @param {string} slideSize - Slide size preset
 */
export function addImageSlide(pptx, imageData, fitMode = 'fit', slideSize = '16:9') {
    const slide = pptx.addSlide();
    const size = SLIDE_SIZES[slideSize] || SLIDE_SIZES['16:9'];

    // Calculate dimensions
    const dimensions = calculateImageDimensions(
        imageData.width,
        imageData.height,
        size.width,
        size.height,
        fitMode
    );

    // Add image to slide
    slide.addImage({
        data: imageData.dataUrl,
        x: dimensions.x,
        y: dimensions.y,
        w: dimensions.width,
        h: dimensions.height,
    });

    // Add page number in bottom right
    slide.addText(`${imageData.pageNumber}`, {
        x: size.width - 0.5,
        y: size.height - 0.3,
        w: 0.4,
        h: 0.2,
        fontSize: 10,
        color: '666666',
        align: 'right',
        valign: 'bottom'
    });
}

/**
 * Generate and download PowerPoint file
 * @param {Array} images - Array of image data objects
 * @param {Object} settings - Conversion settings
 * @param {string} filename - Output filename (without extension)
 * @returns {Promise<void>}
 */
export async function generatePPT(images, settings, filename = 'converted') {
    const { slideSize = '16:9', fitMode = 'fit' } = settings;

    // Create presentation
    const pptx = createPresentation(slideSize);

    // Add each image as a slide
    for (const imageData of images) {
        addImageSlide(pptx, imageData, fitMode, slideSize);
    }

    // Generate the file with proper MIME type
    const pptxBlob = await pptx.write({
        outputType: 'blob',
        compression: true
    });

    // Create a new blob with explicit MIME type to prevent .zip extension
    const properBlob = new Blob([pptxBlob], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    });

    // Download the file
    saveAs(properBlob, `${filename}.pptx`);

    return properBlob;
}

/**
 * Get slide size options
 * @returns {Array} Array of slide size options
 */
export function getSlideeSizeOptions() {
    return Object.keys(SLIDE_SIZES).filter(key => key !== 'Custom');
}

/**
 * Estimate output file size
 * @param {Array} images - Array of image data objects
 * @returns {number} Estimated file size in bytes
 */
export function estimateFileSize(images) {
    // Rough estimation: sum of image blob sizes + overhead
    const imageSize = images.reduce((total, img) => total + (img.blob?.size || 0), 0);
    const overhead = 50000; // ~50KB for PPT structure
    return imageSize + overhead;
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
