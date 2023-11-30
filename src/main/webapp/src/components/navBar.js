import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';


const NavBar = ({ displayInfo, onLogout, onBackToDocument, showBackButton, onDownload, showDownloadButton }) => {
  const isLoggedIn = Cookies.get('uid');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="navbar">
      <span>{displayInfo.label}: {displayInfo.value}</span>
      {showDownloadButton && (
          <button onClick={onDownload} className="download-button"><FontAwesomeIcon icon={faDownload} /></button>
      )}
      {isLoggedIn && showBackButton && (
        <button onClick={onBackToDocument} className="back-button">Back to Document</button>
      )}
      {isLoggedIn ? (
        <button onClick={onLogout} className="logout-button">Logout</button>
      ) : (
        <button onClick={handleLogin} className="login-button">Login</button>
      )}
    </div>
  );
};

NavBar.defaultProps = {
  showBackButton: true
};

export default NavBar;
