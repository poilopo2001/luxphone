import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import './BulkBlockPage.css';

const API_URL = 'http://localhost:5000/api';

const BulkBlockPage = () => {
  const [scamNumbers, setScamNumbers] = useState([]);  // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [blockingStatus, setBlockingStatus] = useState('idle'); // idle, generating, complete
  const [stats, setStats] = useState({
    totalScam: 0,
    lastWeek: 0,
    blockRate: 0
  });

  const fetchScamNumbers = async () => {
    try {
      const response = await fetch(`${API_URL}/scam-numbers`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Ensure we have an array
      const numbers = Array.isArray(data) ? data : [];
      setScamNumbers(numbers);
      setSelectedNumbers(numbers); // By default, select all numbers
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching scam numbers:', error);
      setScamNumbers([]);
      setSelectedNumbers([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScamNumbers();
    // Calculate stats
    const calculateStats = async () => {
      try {
        const response = await fetch(`${API_URL}/scam-numbers`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const numbers = await response.json();
        const total = Array.isArray(numbers) ? numbers.length : 0;
        
        // Simulate last week's numbers (you should get this from your API)
        const lastWeek = Math.floor(total * 0.3);
        
        // Simulate block rate (you should get this from your API)
        const blockRate = 85;

        setStats({
          totalScam: total,
          lastWeek,
          blockRate
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalScam: 0,
          lastWeek: 0,
          blockRate: 0
        });
      }
    };
    calculateStats();
  }, []);

  // Generate vCard for blocking
  const generateBlockingVCard = () => {
    if (!selectedNumbers.length) return;
    
    setBlockingStatus('generating');
    
    const vCardContent = selectedNumbers.map(number => `BEGIN:VCARD
VERSION:3.0
FN:BLOCKED SCAM ${number}
TEL;TYPE=CELL:${number}
CATEGORIES:BLOCKED,SCAM
END:VCARD`).join('\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'block_scam_numbers.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setBlockingStatus('complete');
    setTimeout(() => setBlockingStatus('idle'), 3000);
  };

  // Generate Android blocking instructions
  const generateAndroidInstructions = () => {
    if (!selectedNumbers.length) return '';
    return selectedNumbers.map(number => (
      `content://com.android.contacts/data/${number}`
    )).join('\n');
  };

  // Handle bulk blocking
  const handleBulkBlock = () => {
    if (!selectedNumbers.length) return;

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      // Try to open Android blocking interface
      const instructions = generateAndroidInstructions();
      alert('Instructions pour Android:\n\n' +
            '1. Téléchargez le fichier de contacts\n' +
            '2. Ouvrez vos Contacts\n' +
            '3. Importez le fichier .vcf\n' +
            '4. Allez dans Paramètres > Blocage des appels\n' +
            '5. Sélectionnez les contacts marqués "BLOCKED SCAM"');
      generateBlockingVCard();
    } else if (isIOS) {
      // For iOS, we'll provide the vCard and instructions
      alert('Instructions pour iPhone:\n\n' +
            '1. Téléchargez le fichier de contacts\n' +
            '2. Ouvrez le fichier .vcf\n' +
            '3. Ajoutez tous les contacts\n' +
            '4. Allez dans Réglages > Téléphone > Numéros bloqués\n' +
            '5. Ajoutez les contacts marqués "BLOCKED SCAM"');
      generateBlockingVCard();
    } else {
      // Desktop fallback
      generateBlockingVCard();
    }
  };

  // Share functionality
  const shareUrl = window.location.href;
  const shareTitle = `🛡️ Bloquez ${selectedNumbers.length} numéros de spam identifiés au Luxembourg`;
  const shareText = `J'ai trouvé ${selectedNumbers.length} numéros signalés comme spam sur LuxPhone. Protégez-vous aussi !`;

  const handleShare = (platform) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`
    };

    window.open(urls[platform], '_blank');
  };

  // Toggle all numbers
  const toggleAllNumbers = () => {
    if (selectedNumbers.length === scamNumbers.length) {
      setSelectedNumbers([]);
    } else {
      setSelectedNumbers([...scamNumbers]);
    }
  };

  // Toggle individual number
  const toggleNumber = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  return (
    <div className="bulk-block-page">
      <SEO 
        title={`🛡️ Bloquez ${scamNumbers.length} numéros de spam | Protection contre les arnaques téléphoniques au Luxembourg`}
        description={`Protégez-vous contre ${scamNumbers.length} numéros identifiés comme spam au Luxembourg. Blocage en un clic, mise à jour quotidienne.`}
      />
      <Header />
      
      <main className="bulk-block-container">
        <h1>Protection contre les numéros indésirables</h1>
        
        {isLoading ? (
          <div className="loading">Chargement des numéros...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stats-card">
                <span className="stats-icon">🛡️</span>
                <div className="stats-info">
                  <div className="stats-number">{stats.totalScam}</div>
                  <div className="stats-label">Numéros identifiés</div>
                </div>
              </div>
              <div className="stats-card">
                <span className="stats-icon">📅</span>
                <div className="stats-info">
                  <div className="stats-number">+{stats.lastWeek}</div>
                  <div className="stats-label">Cette semaine</div>
                </div>
              </div>
              <div className="stats-card">
                <span className="stats-icon">📱</span>
                <div className="stats-info">
                  <div className="stats-number">{stats.blockRate}%</div>
                  <div className="stats-label">Taux de blocage</div>
                </div>
              </div>
            </div>

            <div className="block-summary">
              <p>
                {scamNumbers.length} numéros ont été signalés comme spam
                ({selectedNumbers.length} sélectionnés)
              </p>
              <div className="block-actions">
                <button 
                  className="toggle-all"
                  onClick={toggleAllNumbers}
                >
                  {selectedNumbers.length === scamNumbers.length ? 
                    '🔓 Désélectionner tout' : '🔒 Sélectionner tout'}
                </button>
                <button 
                  className="block-button"
                  onClick={handleBulkBlock}
                  disabled={selectedNumbers.length === 0 || blockingStatus === 'generating'}
                >
                  {blockingStatus === 'generating' ? '⏳ Génération...' :
                   blockingStatus === 'complete' ? '✅ Fichier généré !' :
                   '🛡️ Bloquer les numéros sélectionnés'}
                </button>
              </div>
            </div>

            <div className="numbers-list">
              {scamNumbers.map(number => (
                <div key={number} className="number-item">
                  <label className="number-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedNumbers.includes(number)}
                      onChange={() => toggleNumber(number)}
                    />
                    <span className="number">📱 {number}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="share-section">
              <h2>Partagez pour protéger vos proches</h2>
              <div className="share-buttons">
                <button 
                  className="share-button whatsapp" 
                  onClick={() => handleShare('whatsapp')}
                >
                  <span>📱 WhatsApp</span>
                </button>
                <button 
                  className="share-button telegram" 
                  onClick={() => handleShare('telegram')}
                >
                  <span>✈️ Telegram</span>
                </button>
                <button 
                  className="share-button facebook" 
                  onClick={() => handleShare('facebook')}
                >
                  <span>👥 Facebook</span>
                </button>
                <button 
                  className="share-button twitter" 
                  onClick={() => handleShare('twitter')}
                >
                  <span>🐦 Twitter</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BulkBlockPage;
