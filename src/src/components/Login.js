import React from 'react';
import './Login.css';

const Login = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:3001/login'; // Redirect to backend login route
    };

    return (
        <div className="login-container">
            <img src="/Spotify_Full_Logo_RGB_Green.png" alt="Spotify Logo" className="spotify-logo" />
            <h1>Please Login</h1>
            <p>In order to search for artists, tracks, or songs</p>
            <p>you must login to your Spotify account</p>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
};

export default Login;
