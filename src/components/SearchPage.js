import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';

const API_URL = 'http://localhost:5000/api';

const SearchPage = () => {
  const [numero, setNumero] = useState('');
  const [recentScams, setRecentScams] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    scamsBlocked: 0,
    activeUsers: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler le chargement des données (à remplacer par de vraies API calls)
    setRecentScams([
      {
        number: '621123456',
        type: 'Arnaque bancaire',
        reports: 47,
        lastReport: '2024-03-15',
        description: 'Se fait passer pour la BIL, demande des informations bancaires'
      },
      {
        number: '661789012',
        type: 'Démarchage agressif',
        reports: 32,
        lastReport: '2024-03-14',
        description: 'Appels répétés pour vente de panneaux solaires'
      },
      {
        number: '691234567',
        type: 'Fraude CPL',
        reports: 28,
        lastReport: '2024-03-13',
        description: 'Faux technicien CPL demandant accès au compteur'
      }
    ]);

    setTopCategories([
      {
        id: 'banking',
        name: '🏦 Arnaques Bancaires',
        count: 156,
        trend: '+12%',
        description: 'Tentatives d\'hameçonnage bancaire et fraudes financières'
      },
      {
        id: 'energy',
        name: '⚡ Fraudes Énergétiques',
        count: 98,
        trend: '+8%',
        description: 'Faux agents CPL/ENOVOS et arnaques aux compteurs'
      },
      {
        id: 'tax',
        name: '📑 Fraudes Fiscales',
        count: 87,
        trend: '+15%',
        description: 'Fausses communications de l\'Administration des Contributions'
      },
      {
        id: 'packages',
        name: '📦 Arnaques aux Colis',
        count: 76,
        trend: '+20%',
        description: 'Faux messages POST/DHL demandant des paiements'
      }
    ]);

    setStats({
      totalReports: 2547,
      scamsBlocked: 1893,
      activeUsers: 12458
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (numero.trim()) {
      const cleanNumber = numero.replace(/[^0-9]/g, '');
      const validPrefixes = ['621', '628', '661', '668', '691', '698'];
      const isValidMobile = cleanNumber.length === 9 && 
        validPrefixes.some(prefix => cleanNumber.startsWith(prefix));

      if (!isValidMobile) {
        alert('Veuillez entrer un numéro de mobile luxembourgeois valide (ex: 661 297 770)');
        return;
      }
      navigate(`/numero/${cleanNumber}`);
    }
  };

  return (
    <div className="search-page">
      <SEO 
        title="LuxPhone | Protection contre les arnaques téléphoniques au Luxembourg"
        description="Vérifiez et signalez les numéros suspects au Luxembourg. Protection contre les arnaques téléphoniques, fraudes et démarchages abusifs."
      />
      <Header />
      
      <main>
        <section className="hero-section">
          <h1>Protégez-vous des arnaques téléphoniques au Luxembourg</h1>
          <p className="subtitle">Vérifiez instantanément si un numéro a été signalé comme suspect</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <input
                type="tel"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex: 661 297 770"
                className="search-input"
              />
              <button type="submit" className="search-button">
                Vérifier le numéro
              </button>
            </div>
          </form>

          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalReports.toLocaleString()}</span>
              <span className="stat-label">Signalements</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.scamsBlocked.toLocaleString()}</span>
              <span className="stat-label">Arnaques bloquées</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.activeUsers.toLocaleString()}</span>
              <span className="stat-label">Utilisateurs actifs</span>
            </div>
          </div>
        </section>

        <section className="alerts-section">
          <h2>⚠️ Alertes Actuelles</h2>
          <div className="recent-scams">
            {recentScams.map((scam, index) => (
              <div key={index} className="scam-card">
                <div className="scam-header">
                  <span className="scam-type">{scam.type}</span>
                  <span className="scam-reports">{scam.reports} signalements</span>
                </div>
                <p className="scam-number">📞 +352 {scam.number}</p>
                <p className="scam-description">{scam.description}</p>
                <div className="scam-footer">
                  <span className="scam-date">Dernier signalement: {new Date(scam.lastReport).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="categories-section">
          <h2>🎯 Types d'arnaques courants</h2>
          <div className="categories-grid">
            {topCategories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <span className="category-trend">{category.trend}</span>
                </div>
                <div className="category-stats">
                  <span className="category-count">{category.count} cas signalés</span>
                </div>
                <p className="category-description">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="safety-tips-section">
          <h2>🛡️ Guide de Protection</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🔍 Comment identifier une arnaque ?</h3>
              <ul>
                <li>Demande urgente d'informations personnelles</li>
                <li>Pression pour un paiement immédiat</li>
                <li>Menaces ou intimidation</li>
                <li>Offres trop belles pour être vraies</li>
              </ul>
            </div>
            <div className="tip-card">
              <h3>✅ Bonnes pratiques</h3>
              <ul>
                <li>Ne jamais donner d'informations bancaires par téléphone</li>
                <li>Vérifier l'identité de l'appelant</li>
                <li>Ne pas rappeler des numéros inconnus</li>
                <li>Signaler les numéros suspects</li>
              </ul>
            </div>
            <div className="tip-card">
              <h3>📞 Numéros utiles</h3>
              <ul>
                <li>Police Grand-Ducale: 113</li>
                <li>Protection des consommateurs: 247-73700</li>
                <li>CNPD: 247-84200</li>
                <li>Helpline Cyber: 247-88444</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
