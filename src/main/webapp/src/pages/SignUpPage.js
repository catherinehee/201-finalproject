import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import '../css/SignUpPage.css';
import { auth, database, firestore } from '../firebase';
import { Link } from 'react-router-dom';
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
// import { onSnapshot, doc } from "firebase/firestore";

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();


  //default email and pass singup
  const handleSignUp = (event) => {
    event.preventDefault();
    console.log('Signing up with:', email, password, confirmPassword);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential)
        console.log("ID" + userCredential.user.uid)
        const userData = {
          email: userCredential.user.email,
          id: userCredential.user.uid
        };
  
        storeUserData(userCredential.user.uid, userData);
        navigate('/');
      }).catch((error) => {
        console.log(error)
        alert(error)
      })
    
  };

  //signup for Google
  const handleGoogleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("ID" + userCredential.user.uid)
        const userData = {
          email: userCredential.user.email,
        };
  
        storeUserData(userCredential.user.uid, userData);
      })
      .catch((error) => {
        console.error(error);
      });
  };



  //TESTING FOR ADDING ID TO 
  async function storeUserData(uid, userData) {
    try {
      Cookies.set('uid', uid, { expires: 7 });






      const userDocRef = doc(firestore, 'users', uid);
      await setDoc(userDocRef, userData);
      console.log('User data stored successfully');
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }



  //HTML RETURN
  return (
    <div className="login-container">
      <form onSubmit={handleSignUp}>
        <h1>Create your account</h1>
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
        
        <div className="signup-prompt">
          Already have an account?
          <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>Log in</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;