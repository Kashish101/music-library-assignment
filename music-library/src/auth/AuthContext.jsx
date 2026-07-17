import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USERS = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' },
  user: { username: 'user', password: 'user123', role: 'user' },
};

function fakeJwt(payload) {
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (username, password) => {
    const found = Object.values(USERS).find(
      (u) => u.username === username && u.password === password
    );
    if (!found) {
      throw new Error('Invalid username or password');
    }
    const jwt = fakeJwt({ username: found.username, role: found.role });
    localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const role = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);