import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import '../css/SignUpPage.css';
import { auth } from '../firebase';


function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //default email and pass singup
  const handleSignUp = (event) => {
    event.preventDefault();
    console.log('Signing up with:', email, password, confirmPassword);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential)
      }).catch((error) => {
        console.log(error)
      })

  };

  //signup for Google
  const handleGoogleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      }).catch((error) => {
        console.error(error);
      });
  };

  //sign up for Github -> needs config
  const handleGitHubSignUp = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      }).catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSignUp}>
        <h2>Create your account</h2>
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
        <div className="form-group">
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up →</button>
        <button onClick={handleGoogleSignUp} className="other-btn">Sign Up with Google</button >
        <button onClick={handleGitHubSignUp} className="other-btn">Sign Up with GitHub</button>
        <div className="signup-prompt">
          Already have an account? <span className="signup-link">Log In</span>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;