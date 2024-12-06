require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Review = require('./models/Review');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes
// Obtenir tous les avis pour un numéro
app.get('/api/reviews/:phoneNumber', async (req, res) => {
  try {
    const reviews = await Review.find({ phoneNumber: req.params.phoneNumber })
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajouter un nouvel avis
app.post('/api/reviews', async (req, res) => {
  // Vérifier les honeypots pour détecter les robots
  if (req.body.honeypot1 || req.body.honeypot2) {
    return res.status(400).json({ message: 'Détection de robot' });
  }

  try {
    const review = new Review(req.body);
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mettre à jour le compteur "utile"
app.patch('/api/reviews/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }
    review.helpfulCount += 1;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all scam numbers
app.get('/api/scam-numbers', async (req, res) => {
  try {
    // Find all reviews that are negative (scam)
    const scamReviews = await Review.find({ type: 'negative' })
      .select('phoneNumber -_id') // Only get phone numbers, exclude _id
      .distinct('phoneNumber'); // Get unique numbers only
    
    res.json(scamReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Servir les fichiers statiques du dossier public
app.use(express.static('public'));

// Route pour le sitemap index
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/sitemaps/sitemap-index.xml'));
});

// Route pour les sitemaps individuels
app.get('/sitemaps/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, 'public/sitemaps', filename));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
