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
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { database, firestore } from '../firebase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    console.log('Logging in with:', email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);

        const userData = {
          email: userCredential.user.email,
          id: userCredential.user.uid
        };

        storeUserData(userCredential.user.uid, userData);
        navigate('/');
      })
      .catch((error) => {
        alert('Invalid you idiot ', email, password);
        console.error(error);
      });

      
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        console.log(userCredential);

        const userData = {
          email: userCredential.user.email,
          id: userCredential.user.uid
        };
  
        storeUserData(userCredential.user.uid, userData);
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function storeUserData(uid, userData) {
    try {
      Cookies.set('uid', uid, { expires: 7 });
      //const userDocRef = doc(firestore, 'users', uid);
      //await setDoc(userDocRef, userData);
      //console.log('User data stored successfully');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }
 

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h1>Log in to your account</h1>
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

       

        <div className="signup-prompt">
          Don't have an account?
          <Link to="/signup" style={{ textDecoration: 'none', color: 'blue' }} >Sign up</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;