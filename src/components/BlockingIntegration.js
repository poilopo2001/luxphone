import React from 'react';

const BlockingIntegration = ({ phoneNumber }) => {
  // Function to generate Android intent URI for blocking
  const getAndroidBlockingUri = () => {
    // Different formats for different Android versions/manufacturers
    const uris = {
      default: `tel:${phoneNumber}#`, // Opens dialer
      samsung: `content://com.android.contacts/data/${phoneNumber}`,
      google: `market://details?id=com.google.android.dialer&phoneNumber=${phoneNumber}`,
      // Add more manufacturer-specific URIs as needed
    };
    return uris;
  };

  // Function to generate iOS blocking URI
  const getIOSBlockingUri = () => {
    return `App-Prefs:root=Phone&path=Blocking/${phoneNumber}`;
  };

  // Detect device type
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Handle block button click
  const handleBlockClick = () => {
    if (isAndroid) {
      // Try to open Android blocking interface
      const uris = getAndroidBlockingUri();
      // Try different URIs until one works
      Object.values(uris).forEach(uri => {
        try {
          window.location.href = uri;
        } catch (e) {
          console.log('Failed to open URI:', uri);
        }
      });
    } else if (isIOS) {
      // Try to open iOS blocking settings
      window.location.href = getIOSBlockingUri();
    } else {
      // Fallback for desktop - show manual instructions
      alert('Pour bloquer ce numéro sur votre téléphone:\n\n' +
            'Android:\n' +
            '1. Ouvrez l\'application Téléphone\n' +
            '2. Appuyez sur les 3 points ⋮\n' +
            '3. Sélectionnez "Paramètres"\n' +
            '4. Choisissez "Numéros bloqués"\n' +
            '5. Ajoutez ' + phoneNumber + '\n\n' +
            'iPhone:\n' +
            '1. Ouvrez Réglages\n' +
            '2. Sélectionnez "Téléphone"\n' +
            '3. Appuyez sur "Numéros bloqués"\n' +
            '4. Ajoutez ' + phoneNumber);
    }
  };

  // Generate download link for contact file
  const generateBlockingVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:BLOCKED ${phoneNumber}
TEL;TYPE=CELL:${phoneNumber}
CATEGORIES:BLOCKED
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `block_${phoneNumber}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="blocking-integration">
      <h3>Bloquer ce numéro</h3>
      <div className="blocking-buttons">
        <button 
          onClick={handleBlockClick}
          className="block-button primary">
          Bloquer sur mon téléphone
        </button>
        <button 
          onClick={generateBlockingVCard}
          className="block-button secondary">
          Télécharger le contact de blocage
        </button>
      </div>
      <p className="blocking-note">
        Note: La méthode de blocage peut varier selon votre appareil et votre système d'exploitation.
      </p>
    </div>
  );
};

export default BlockingIntegration;
