import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // CHECK LOGIN SESSION
  // ============================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem('trendcart_current_user');

    const token =
      localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ============================================
  // SIGNUP
  // ============================================

  const signup = async (email, password, name) => {
    try {
      const response = await fetch(
        `${API_URL}/api/signup`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Signup failed'
        );
      }

      // Save JWT
      localStorage.setItem(
        'token',
        data.token
      );

      // Save user
      localStorage.setItem(
        'trendcart_current_user',
        JSON.stringify(data.user)
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
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            emailOrName,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Login failed'
        );
      }

      // ========================================
      // SAVE JWT
      // ========================================

      localStorage.setItem(
        'token',
        data.token
      );

      // ========================================
      // SAVE USER
      // ========================================

      localStorage.setItem(
        'trendcart_current_user',
        JSON.stringify(data.user)
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

  // ============================================
  // LOGOUT
  // ============================================

  const logout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem(
      'trendcart_current_user'
    );

    setUser(null);
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