const express = require('express');
const vision = require('@google-cloud/vision');
const router = express.Router();
const client = new vision.ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  });

router.post('/recognize-food', async (req, res) => {
  try {
    const { image } = req.body;
    const [result] = await client.labelDetection({
      image: {
        content: image
      }
    });
    const labels = result.labelAnnotations;
    res.json({ labels });
  } catch (error) {
    console.error('Erreur lors de la reconnaissance d\'image:', error);
    res.status(500).json({ error: 'Échec de la reconnaissance de l\'aliment' });
  }
});

module.exports = router;
