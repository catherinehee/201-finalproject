import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ displayInfo, onLogout, onBackToDocument, showBackButton }) => {
  const isLoggedIn = Cookies.get('uid');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="navbar">
      <span>{displayInfo.label}: {displayInfo.value}</span>
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
