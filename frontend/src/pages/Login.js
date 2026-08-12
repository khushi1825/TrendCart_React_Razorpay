import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';

import {
  Link,
  useNavigate
} from 'react-router-dom';


const Login = () => {

  const [emailOrName, setEmailOrName] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState('');

  const { login } = useAuth();

  const navigate = useNavigate();


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    try {

      await login(
        emailOrName,
        password
      );

      navigate('/');

    } catch (err) {

      console.error(
        'Login error:',
        err
      );

      setError(
        err.message ||
        'Login failed'
      );

    }
  };


  return (

    <div
      className="container"
      style={{
        maxWidth: '480px',
        marginTop: '3rem',
        marginBottom: '3rem'
      }}
    >

      <div
        className="vote-section"
        style={{
          padding: '2rem'
        }}
      >

        <h2
          style={{
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}
        >
          Welcome back
        </h2>

        <p
          style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '2rem'
          }}
        >
          Log in to your TrendCart account
        </p>


        {error && (
          <div
            className="notification"
            style={{
              background: '#ffcccc',
              color: 'red',
              marginBottom: '1rem'
            }}
          >
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Email address or Username
            </label>

            <input
              type="text"
              value={emailOrName}
              onChange={(e) =>
                setEmailOrName(
                  e.target.value
                )
              }
              required
              placeholder="iamkhushi5621@gmail.com"
            />

          </div>


          <div
            className="form-group"
            style={{
              position: 'relative'
            }}
          >

            <label>
              Password
            </label>

            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
                placeholder="********"
                style={{
                  flex: 1
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  marginLeft: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                {showPassword
                  ? '🙈'
                  : '👁️'}
              </button>

            </div>

          </div>


          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '1.5rem'
            }}
          >

            <Link
              to="/forgot-password"
              style={{
                fontSize: '0.9rem',
                color: '#e91e63'
              }}
            >
              Forgot password?
            </Link>

          </div>


          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem'
            }}
          >
            Log in →
          </button>

        </form>


        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem'
          }}
        >
          Don't have an account?{' '}

          <Link
            to="/signup"
            style={{
              color: '#e91e63'
            }}
          >
            Create account
          </Link>

        </p>

      </div>


      <div
        style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '0.8rem',
          color: '#888'
        }}
      >
        ✅ Ethically made | Free shipping on
        orders ₹5000+
      </div>

    </div>
  );
};


export default Login;