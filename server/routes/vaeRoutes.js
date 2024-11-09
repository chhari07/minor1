const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs-node'); // Example with TensorFlow.js (adjust if using another library)
const path = require('path');
const fs = require('fs');

// Load a pre-trained VAE model
// Assumes the VAE model is in a saved model format
const vaeModelPath = path.join(__dirname, '../models/vaeModel');
let vaeModel;

// Load the model when the server starts
tf.loadLayersModel(`file://${vaeModelPath}/model.json`)
    .then(model => {
        vaeModel = model;
        console.log('VAE Model loaded successfully.');
    })
    .catch(err => {
        console.error('Error loading VAE model:', err);
    });

// Function to generate image using the VAE model
const generateImageFromVAE = async (input) => {
    try {
        // Create some input tensor (e.g., random noise or based on prompt)
        const latentSpaceInput = tf.randomNormal([1, 128]);  // Adjust latent space dimension as needed

        // Generate the image using the decoder part of the VAE model
        const generatedImage = vaeModel.predict(latentSpaceInput);

        // Process and return the image as a buffer (convert Tensor to Buffer)
        const imageTensor = generatedImage.squeeze().mul(255).cast('int32'); // Adjust scaling for image pixel values
        const imageBuffer = await tf.node.encodePng(imageTensor);

        return imageBuffer;
    } catch (error) {
        console.error('Error generating image from VAE:', error);
        throw error;
    }
};

// VAE image generation route
router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Prompt is required.' });
        }

        // Generate an image using the VAE model
        const generatedImageBuffer = await generateImageFromVAE(prompt);

        if (!generatedImageBuffer) {
            return res.status(500).json({ success: false, message: 'Failed to generate image.' });
        }

        // Create a unique file name for the image
        const imageName = `vae_image_${Date.now()}.png`;
        const imagePath = path.join(__dirname, '../dataset/generated_images', imageName);

        // Save the image buffer to a file
        fs.writeFileSync(imagePath, generatedImageBuffer);

        // Send back the image URL (assuming you're serving images statically from /dataset/generated_images)
        const imageUrl = `/dataset/generated_images/${imageName}`;

        res.status(200).json({ success: true, imageUrl });
    } catch (error) {
        console.error('Error generating VAE image:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
