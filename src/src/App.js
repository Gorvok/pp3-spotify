import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Search from './components/Search';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let token = localStorage.getItem('token');
        const tempState = new URLSearchParams(window.location.search).get('tempState');
        const jwt = new URLSearchParams(window.location.search).get('jwt');

        if (tempState && jwt) {
          // Fetch tokens using tempState and jwt
          const response = await axios.get(`http://localhost:3001/get-tokens?tempState=${tempState}&jwt=${jwt}`);
          const { access_token, refresh_token, jwt: fetchedToken } = response.data;

          // Store tokens in local storage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('token', fetchedToken);
          token = fetchedToken;
          window.history.replaceState({}, document.title, "/"); // Remove tempState and jwt from URL
        }

        if (token) {
          // Validate the token
          const response = await axios.get('http://localhost:3001/validate-token', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.valid) {
            setIsAuthenticated(true);
            navigate('/dashboard');
          } else {
            setIsAuthenticated(false);
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={isAuthenticated ? <Search /> : <Login />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Login />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login />} />
        </Routes>
      </div>
  );
}

export default App;
