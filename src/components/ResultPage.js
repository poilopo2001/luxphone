import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import './ResultPage.css';
import BlockingIntegration from './BlockingIntegration';
import './BlockingIntegration.css';

const API_URL = 'http://localhost:5000/api';

const ResultPage = () => {
  const { numero } = useParams();
  const navigate = useNavigate();
  const [reviewType, setReviewType] = useState('');
  const [reviewSubType, setReviewSubType] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si le numéro est valide et charger les avis
  useEffect(() => {
    // Vérifier si c'est un numéro mobile luxembourgeois valide (9 chiffres)
    const validPrefixes = ['621', '628', '661', '668', '691', '698'];
    const isValidMobile = numero && 
      numero.length === 9 && 
      validPrefixes.some(prefix => numero.startsWith(prefix));

    if (!isValidMobile) {
      setIsValidNumber(false);
      navigate('/');
      return;
    }

    setIsValidNumber(true);
    fetchReviews();
  }, [numero, navigate]);

  // Charger les avis depuis l'API
  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/${numero}`);
      if (!response.ok) throw new Error('Erreur lors du chargement des avis');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewTypeSelect = (type) => {
    setReviewType(type);
    setReviewSubType('');
    setShowReviewForm(true);
  };

  const handleSubTypeSelect = (subType) => {
    setReviewSubType(subType);
    // Générer automatiquement le texte de l'avis basé sur le sous-type
    let reviewText = '';
    if (reviewType === 'positive') {
      reviewText = `Numéro vérifié comme ${subType}`;
    } else {
      const descriptions = {
        'Arnaque Bancaire': 'Ce numéro a été signalé pour tentative de fraude bancaire. Se fait passer pour une banque et demande des informations sensibles.',
        'Fraude Énergétique': 'Faux agent énergétique tentant d\'obtenir des informations ou un accès au compteur.',
        'Fraude Fiscale': 'Se fait passer pour l\'Administration des Contributions Directes.',
        'Arnaque Colis': 'Faux message concernant un colis avec demande de paiement.',
        'Démarchage': 'Appels répétés pour du démarchage commercial non sollicité.',
        'Autre Arnaque': 'Attention: Ce numéro a été signalé comme suspect.'
      };
      reviewText = descriptions[subType] || `Attention: Ce numéro a été signalé pour ${subType}`;
    }
    handleSubmitReview(reviewText);
  };

  const handleSubmitReview = async (text) => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: numero,
          type: reviewType,
          subType: reviewSubType,
          text: text,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi de l\'avis');
      
      const newReview = await response.json();
      setReviews([newReview, ...reviews]);
      setReviewType('');
      setReviewSubType('');
      setShowReviewForm(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleScroll = (direction) => {
    const container = document.querySelector('.quick-review-buttons');
    const scrollAmount = 240; // Twice the width of a button
    if (container) {
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const resetReview = () => {
    setReviewType('');
    setReviewSubType('');
    setShowReviewForm(false);
  };

  const renderReviewButtons = () => {
    if (!showReviewForm) {
      return (
        <div className="quick-review-buttons">
          <button
            className="quick-review-btn positive"
            onClick={() => handleReviewTypeSelect('positive')}
          >
            <span className="icon">👍</span>
            <span className="text">C'est sûr</span>
          </button>
          <button
            className="quick-review-btn negative"
            onClick={() => handleReviewTypeSelect('negative')}
          >
            <span className="icon">👎</span>
            <span className="text">Arnaque</span>
          </button>
        </div>
      );
    }

    return (
      <div className="review-selection">
        <div className="quick-review-container">
          {reviewType === 'positive' ? (
            <div className="quick-review-buttons">
              <button
                className="quick-review-btn"
                onClick={() => handleSubTypeSelect('Entreprise Légitime')}
              >
                <span className="icon">🏢</span>
                <span className="text">Entreprise Légitime</span>
              </button>
              <button
                className="quick-review-btn"
                onClick={() => handleSubTypeSelect('Service Public')}
              >
                <span className="icon">🏛️</span>
                <span className="text">Service Public</span>
              </button>
            </div>
          ) : (
            <div className="quick-review-buttons">
              <button
                className="quick-review-btn negative"
                onClick={() => handleSubTypeSelect('Arnaque Bancaire')}
              >
                <span className="icon">🏦</span>
                <span className="text">Arnaque Bancaire</span>
              </button>
              <button
                className="quick-review-btn negative"
                onClick={() => handleSubTypeSelect('Fraude Énergétique')}
              >
                <span className="icon">⚡</span>
                <span className="text">Fraude Énergétique</span>
              </button>
              <button
                className="quick-review-btn negative"
                onClick={() => handleSubTypeSelect('Fraude Fiscale')}
              >
                <span className="icon">📑</span>
                <span className="text">Fraude Fiscale</span>
              </button>
              <button
                className="quick-review-btn negative"
                onClick={() => handleSubTypeSelect('Arnaque Colis')}
              >
                <span className="icon">📦</span>
                <span className="text">Arnaque Colis</span>
              </button>
              <button
                className="quick-review-btn negative"
                onClick={() => handleSubTypeSelect('Démarchage')}
              >
                <span className="icon">📞</span>
                <span className="text">Démarchage</span>
              </button>
              <button
                className="quick-review-btn negative"
                onClick={() => handleSubTypeSelect('Autre Arnaque')}
              >
                <span className="icon">⚠️</span>
                <span className="text">Autre Arnaque</span>
              </button>
            </div>
          )}
        </div>
        <button 
          className="back-button" 
          onClick={resetReview}
          aria-label="Retour au choix précédent"
        >
          <span className="icon">↩️</span>
          <span className="text">Retour</span>
        </button>
      </div>
    );
  };

  const handleHelpful = async (reviewId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      const updatedReview = await response.json();
      setReviews(reviews.map(review => 
        review._id === reviewId ? updatedReview : review
      ));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const calculateStats = () => {
    const totalReviews = reviews.length;
    const positiveReviews = reviews.filter(review => review.type === 'positive').length;
    const negativeReviews = totalReviews - positiveReviews;
    const trustScore = totalReviews > 0 
      ? Math.round((positiveReviews / totalReviews) * 100) 
      : 0;
    const isScam = totalReviews >= 3 && trustScore < 50;

    return {
      totalReviews,
      positiveReviews,
      negativeReviews,
      trustScore,
      isScam,
    };
  };

  const stats = calculateStats();

  const getRecentTrends = () => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentReviews = reviews.filter(review => 
      new Date(review.date) > last30Days
    );

    const recentPositive = recentReviews.filter(review => review.type === 'positive').length;
    const recentTotal = recentReviews.length;
    const recentTrend = recentTotal > 0 
      ? Math.round((recentPositive / recentTotal) * 100) 
      : 0;

    return {
      recentTotal,
      recentPositive,
      recentTrend,
      isImproving: recentTrend > stats.trustScore
    };
  };

  const trends = getRecentTrends();

  const chartData = {
    labels: reviews.map(review => new Date(review.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Avis positifs',
        data: reviews.map(review => review.type === 'positive' ? 1 : 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Avis négatifs',
        data: reviews.map(review => review.type === 'negative' ? 1 : 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      }
    ]
  };

  const getStatusMessage = () => {
    if (stats.totalReviews === 0) {
      return "En attente d'avis";
    }
    if (stats.totalReviews < 3) {
      return "Pas assez d'avis";
    }
    return stats.isScam ? "Numéro suspect" : "Numéro sûr";
  };

  const getStatusClass = () => {
    if (stats.totalReviews === 0 || stats.totalReviews < 3) {
      return "pending";
    }
    return stats.isScam ? "scam" : "safe";
  };

  const formatPhoneNumber = (num) => {
    if (!num) return '';
    // Format: XXX XXX XXX (format luxembourgeois)
    return num.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const getNumberType = () => {
    if (!numero) return '';
    
    const mobilePrefixes = ['621', '628', '661', '668', '691', '698'];
    if (mobilePrefixes.some(prefix => numero.startsWith(prefix))) {
      return 'Mobile';
    }
    return 'Fixe';
  };

  return (
    <div className="result-page">
      <SEO 
        title={`${formatPhoneNumber(numero)} - Avis et Signalements | Arnaque ou Fiable ?`}
        description={`Découvrez si le ${formatPhoneNumber(numero)} est une arnaque ou un numéro fiable. Avis et signalements des utilisateurs sur ce numéro de téléphone.`}
        keywords={`${numero}, numéro de téléphone, Luxembourg, avis, ${getNumberType()}, arnaque, sécurité`}
      />
      <Header />
      
      <section className="result-hero">
        <div className="hero-content">
          <div className="number-display">
            <h1>
              Numéro {formatPhoneNumber(numero)} : Arnaque ou Fiable ?<br />
              Avis et Signalements des Utilisateurs
            </h1>
          </div>
          
          <span className={`status-badge ${getStatusClass()}`}>
            {getStatusMessage()}
          </span>
          
          {renderReviewButtons()}
        </div>
      </section>

      <main className="result-container">
        {showReviewForm && (
          <div className="mobile-review-form">
            <form onSubmit={(e) => e.preventDefault()}></form>
          </div>
        )}
        <BlockingIntegration phoneNumber={numero} />
        
        <div className="content-grid">
          <div className="main-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Avis total</h3>
                <div className={`stat-number ${stats.totalReviews === 0 ? 'zero' : ''}`}>
                  {stats.totalReviews}
                </div>
              </div>
              <div className="stat-card">
                <h3>Avis positifs</h3>
                <div className={`stat-number positive ${stats.positiveReviews === 0 ? 'zero' : ''}`}>
                  {stats.positiveReviews}
                </div>
              </div>
              <div className="stat-card">
                <h3>Avis négatifs</h3>
                <div className={`stat-number negative ${stats.negativeReviews === 0 ? 'zero' : ''}`}>
                  {stats.negativeReviews}
                </div>
              </div>
              <div className="stat-card">
                <h3>Score de confiance</h3>
                <div className={`stat-number ${stats.trustScore === 0 ? 'zero' : ''}`}>
                  {stats.trustScore}%
                </div>
              </div>
            </div>

            <section className="info-section">
              <h2>À propos de ce numéro</h2>
              <div className="info-grid">
                <div className="info-card">
                  <h3>Type de numéro</h3>
                  <p>{getNumberType()}</p>
                </div>
                <div className="info-card">
                  <h3>Région</h3>
                  <p>Luxembourg</p>
                </div>
                <div className="info-card">
                  <h3>Format international</h3>
                  <p>+352 {formatPhoneNumber(numero)}</p>
                </div>
              </div>
            </section>

            <section className="trends-section">
              <h2>Tendances récentes</h2>
              <div className="trends-content">
                <div className="trend-stats">
                  <div className="trend-item">
                    <span className="trend-label">Avis ce mois</span>
                    <span className="trend-value">{trends.recentTotal}</span>
                  </div>
                  <div className="trend-item">
                    <span className="trend-label">Tendance</span>
                    <span className={`trend-value ${trends.isImproving ? 'positive' : 'negative'}`}>
                      {trends.isImproving ? '↗' : '↘'} {trends.recentTrend}%
                    </span>
                  </div>
                </div>
                <p className="trend-description">
                  {trends.recentTotal === 0 
                    ? "Aucun avis ce mois-ci" 
                    : `${trends.recentTrend}% des ${trends.recentTotal} avis récents sont positifs`}
                </p>
              </div>
              <Line data={chartData} />
            </section>

            <section className="faq-section">
              <h2>Questions Fréquemment Posées</h2>
              <div className="faq-item">
                <h3>Le numéro {formatPhoneNumber(numero)} est-il une arnaque ?</h3>
                <p>{stats.isScam ? "Ce numéro a été signalé comme suspect par plusieurs utilisateurs." : "Aucun signalement d'arnaque pour ce numéro."}</p>
              </div>
              <div className="faq-item">
                <h3>Le numéro {formatPhoneNumber(numero)} envoie-t-il des SMS de phishing ?</h3>
                <p>{reviews.some(review => review.text.toLowerCase().includes('sms phishing')) ? "Des utilisateurs ont signalé des SMS de phishing provenant de ce numéro." : "Aucun signalement de SMS de phishing pour ce numéro."}</p>
              </div>
            </section>

            <section className="review-section">
              <h2>Avis des utilisateurs</h2>
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <div className="no-reviews">
                    <p>Aucun avis pour le moment</p>
                    <p>Soyez le premier à partager votre expérience avec ce numéro !</p>
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <span className={`review-type ${review.type}`}>
                          {review.type === 'positive' ? 'Avis Positif' : 'Avis Négatif'}
                        </span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <p className="review-text">{review.text}</p>
                      <div className="review-footer">
                        <button
                          className="helpful-button"
                          onClick={() => handleHelpful(review._id)}
                        >
                          Utile ({review.helpfulCount})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="sidebar">
            <div className="safety-tips">
              <h3>Conseils de sécurité</h3>
              <ul>
                <li>Ne jamais communiquer vos informations bancaires</li>
                <li>Méfiez-vous des offres trop alléchantes</li>
                <li>Ne rappelez pas les numéros inconnus suspects</li>
                <li>En cas de doute, raccrochez immédiatement</li>
              </ul>
            </div>
            <div className="report-section">
              <h3>Signaler un abus</h3>
              <p>Si vous êtes victime d'une arnaque, contactez :</p>
              <ul>
                <li>Police Grand-Ducale : <strong>113</strong></li>
                <li>BEE SECURE Helpline : <strong>8002-1234</strong></li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultPage;
