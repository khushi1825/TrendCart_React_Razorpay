import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

const AuthContext = createContext();

const API_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CHECK LOGIN SESSION
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem('token');

    console.log(
      'AUTH TOKEN EXISTS:',
      !!token
    );

    console.log(
      'API URL:',
      API_URL
    );

    if (!token) {
      setLoading(false);
      return;
    }

    const verifyUser = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/me`,
          {
            method: 'GET',

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        const data =
          await response.json();

        console.log(
          'ME STATUS:',
          response.status
        );

        console.log(
          'ME RESPONSE:',
          data
        );

        if (!response.ok) {
          // Token is genuinely invalid/expired
          localStorage.removeItem('token');
          setUser(null);
          return;
        }

        setUser(data.user);

      } catch (error) {
        console.error(
          'Session verification error:',
          error
        );

        // IMPORTANT:
        // Do NOT remove token for temporary
        // network/server errors.
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

  }, []);

  // =====================================================
  // SIGNUP
  // =====================================================

  const signup = async (
    email,
    password,
    name
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/api/signup`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Signup failed'
        );
      }

      // Backend MUST return token
      if (!data.token) {
        throw new Error(
          'Token was not returned by server'
        );
      }

      // Save JWT
      localStorage.setItem(
        'token',
        data.token
      );

      console.log(
        'SIGNUP TOKEN SAVED:',
        !!localStorage.getItem('token')
      );

      setUser(data.user);

      return data.user;

    } catch (error) {

      console.error(
        'Signup error:',
        error
      );

      throw error;
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (
    emailOrName,
    password
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/api/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            emailOrName,
            password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          'Login failed'
        );
      }

      // Backend MUST return JWT
      if (!data.token) {
        throw new Error(
          'Token was not returned by server'
        );
      }

      // Save JWT
      localStorage.setItem(
        'token',
        data.token
      );

      console.log(
        'LOGIN TOKEN SAVED:',
        !!localStorage.getItem('token')
      );

      setUser(data.user);

      return data.user;

    } catch (error) {

      console.error(
        'Login error:',
        error
      );

      throw error;
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem(
      'token'
    );

    setUser(null);
  };

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);