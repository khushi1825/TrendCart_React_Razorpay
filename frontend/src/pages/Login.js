import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailOrName, setEmailOrName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials if "Remember me" was checked before
  useEffect(() => {
    const saved = localStorage.getItem('trendcart_saved_login');
    if (saved) {
      const { emailOrName: savedEmail, password: savedPass } = JSON.parse(saved);
      setEmailOrName(savedEmail);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    await login(emailOrName, password);

    if (rememberMe) {
      localStorage.setItem(
        'trendcart_saved_login',
        JSON.stringify({
          emailOrName,
          password
        })
      );
    } else {
      localStorage.removeItem('trendcart_saved_login');
    }

    navigate('/');

  } catch (err) {
    console.error('Login error:', err);
    setError(err.message);
  }
};

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '3rem', marginBottom: '3rem' }}>
      <div className="vote-section" style={{ padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome back</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>Log in to your TrendCart account</p>
        
        {error && <div className="notification" style={{ background: '#ffcccc', color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address or Username</label>
            <input 
              type="text" 
              value={emailOrName} 
              onChange={(e) => setEmailOrName(e.target.value)} 
              required 
              placeholder="iamkhushi5621@gmail.com"
            />
          </div>
          
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="********"
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> 
              Remember me
            </label>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#e91e63' }}>Forgot password?</Link>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Log in →</button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#e91e63' }}>Create account</Link>
        </p>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#888' }}>
        ✅ Ethically made | Free shipping on orders ₹5000+
      </div>
    </div>
  );
};

export default Login;