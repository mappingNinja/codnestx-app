import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import authContext from './authContext';

const AuthState = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.user || 'null'));

  useEffect(() => {
    setUser(JSON.parse(localStorage.user || 'null'));
  }, [localStorage]);

  const getConfig = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.token || ''}`
      }
    }

    return config;
  }

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    return;
  }

  return (
    <authContext.Provider value={{ user, setUser, getConfig, logout }}>
      {children}
    </authContext.Provider>
  )
}

export default AuthState;