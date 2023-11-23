import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import { auth } from '../firebase'; // Assuming you have this export in your firebase.js
import '../css/LoginPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Logging in with:', email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGitHubLogin = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Log in to your account</h2>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login →</button>
        <button type="button" onClick={handleGoogleLogin} className="other-btn">
          Sign in with Google
        </button>

        <button type="button" onClick={handleGitHubLogin} className="other-btn">
          Sign in with GitHub
        </button>
        <div className="signup-prompt">
          Don't have an account?
        </div>
      </form>
    </div>
  );
}

export default LoginPage;