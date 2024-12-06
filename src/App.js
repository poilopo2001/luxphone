import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import ResultPage from './components/ResultPage';
import BulkBlockPage from './components/BulkBlockPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/numero/:numero" element={<ResultPage />} />
        <Route path="/block-scam" element={<BulkBlockPage />} />
      </Routes>
    </Router>
  );
}

export default App;
