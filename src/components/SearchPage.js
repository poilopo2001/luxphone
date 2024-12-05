import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';

const SearchPage = () => {
  const [numero, setNumero] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    if (numero.trim()) {
      // Nettoyer le numéro (enlever les espaces et caractères spéciaux)
      const cleanNumber = numero.replace(/[^0-9]/g, '');
      
      // Vérifier si c'est un numéro mobile luxembourgeois valide
      const validPrefixes = ['621', '628', '661', '668', '691', '698'];
      const isValidMobile = cleanNumber.length === 9 && 
        validPrefixes.some(prefix => cleanNumber.startsWith(prefix));

      if (!isValidMobile) {
        alert('Veuillez entrer un numéro de mobile luxembourgeois valide (ex: 661 297 770)');
        return;
      }

      console.log('Navigating to:', `/numero/${cleanNumber}`); // Debug
      navigate(`/numero/${cleanNumber}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="container">
      <SEO 
        title="Annuaire Téléphonique Luxembourg | Vérifiez les Numéros Suspects"
        description="Recherchez des informations sur les numéros de téléphone au Luxembourg. Consultez les avis et signalements pour identifier les appels indésirables et les arnaques."
        keywords="annuaire téléphonique, Luxembourg, numéro suspect, arnaque téléphonique, avis, signalement, sécurité"
      />
      <Header />
      <div className="search-section">
        <h1>Annuaire Téléphonique Luxembourg</h1>
        <p>Recherchez des numéros de téléphone et découvrez les avis de la communauté</p>
        <div className="search-box">
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Entrez un numéro de téléphone (+352...)"
          />
          <button onClick={handleSearch}>Rechercher</button>
        </div>
      </div>

      <div className="main-content">
        <div className="section-card">
          <h2>Catégories Populaires</h2>
          <ul>
            <li><a href="#">🏢 Entreprises</a></li>
            <li><a href="#">🛍️ Commerces</a></li>
            <li><a href="#">🏥 Services de Santé</a></li>
            <li><a href="#">🏦 Services Financiers</a></li>
          </ul>
        </div>

        <div className="section-card">
          <h2>Numéros Récents</h2>
          <ul>
            <li><a href="#">📞 +352 123 456 - Service Client</a></li>
            <li><a href="#">📞 +352 654 321 - Support Technique</a></li>
            <li><a href="#">📞 +352 789 012 - Information</a></li>
          </ul>
        </div>

        <div className="section-card">
          <h2>Informations Utiles</h2>
          <ul>
            <li><a href="#">📋 Comment signaler un numéro</a></li>
            <li><a href="#">⚠️ Éviter les arnaques téléphoniques</a></li>
            <li><a href="#">💡 Conseils de sécurité</a></li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
