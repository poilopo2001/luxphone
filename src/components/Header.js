import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav>
        <Link to="/" className="logo">📞 LuxNumbers</Link>
        <ul>
          <li><Link to="/" className="nav-link">Accueil</Link></li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/signaler">Signaler un numéro</Link></li>
          <li><Link to="/block-scam" className="nav-link">Bloquer les spams</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
