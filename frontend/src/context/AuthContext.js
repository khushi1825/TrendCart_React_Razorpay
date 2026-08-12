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

  // ============================================
  // CHECK LOGIN SESSION
  // ============================================

  useEffect(() => {

    const verifyUser = async () => {

      try {

        const response = await fetch(
          `${API_URL}/api/me`,
          {
            method: 'GET',
            credentials: 'include'
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          setUser(null);
          return;
        }

        setUser(data.user);

      } catch (error) {

        console.error(
          'Session verification error:',
          error
        );

        setUser(null);

      } finally {

        setLoading(false);

      }
    };

    verifyUser();

  }, []);

  // ============================================
  // SIGNUP
  // ============================================

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

          credentials: 'include',

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

      // JWT is now stored
      // in HttpOnly cookie by backend

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

  // ============================================
  // LOGIN
  // ============================================

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

          credentials: 'include',

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

      // No localStorage token

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

  // ============================================
  // LOGOUT
  // ============================================

  const logout = async () => {

    try {

      await fetch(
        `${API_URL}/api/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

    } catch (error) {

      console.error(
        'Logout error:',
        error
      );

    } finally {

      setUser(null);

    }
  };

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