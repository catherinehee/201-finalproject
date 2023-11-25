// Router.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DocumentEditPage from './pages/DocumentEditPage';
import FileSystem from './pages/FileSystem';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/documents/edit/:documentID" element={<DocumentEditPage />} />
        <Route exact path="/:uid/files" element={<FileSystem />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
