// utils/dataPreprocessing.js

const sharp = require('sharp');

/**
 * Preprocesses the image: resize, crop, format conversion.
 * @param {Buffer | String} image - Path to the image or Buffer of the image.
 * @returns {Promise<Buffer>} - Processed image buffer.
 */
const preprocessImage = async (image) => {
    try {
        const processedImage = await sharp(image)
            .resize({
                width: 1024,    // Resize image to 1024x1024
                height: 1024,
                fit: sharp.fit.cover,  // Cover the entire area, cropping if necessary
            })
            .toFormat('png')  // Convert to PNG format (changeable to jpg, webp, etc.)
            .toBuffer();  // Return processed image as buffer

        return processedImage;
    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
};

module.exports = { preprocessImage };
