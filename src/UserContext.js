// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from './App';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    userId: '',
    userName: '',
    role: ''
  });

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    const name = localStorage.getItem('name');
    const id = localStorage.getItem('id');
    const img = localStorage.getItem('img');    

    const role = localStorage.getItem('role');
    setUser({
      isLoggedIn: !!auth,
      userName: name || '',
      userId: id || '',
      role: role || '',
      img: img || '',

    });
  }, []);

  const updateUser = (name, id, img) => {
    localStorage.setItem('name', name);
    localStorage.setItem('id', id);
    localStorage.setItem('img', img); // Store the image URL, not the file object

    setUser({
      isLoggedIn: !!localStorage.getItem('auth'),
      userName: name,
      userId: id,
      img: img || user.img,
    });
  };
  const logout = async() => {
    const token = localStorage.getItem('auth'); // Retrieve the token from localStorage
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send the token in the request body
      });
  
      const result = await response.json();
      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('auth');
        localStorage.removeItem('role');
        localStorage.removeItem('userid');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('name');
        localStorage.removeItem('id');
        localStorage.removeItem('img');
        localStorage.removeItem('email');
        setUser({
                  isLoggedIn: false,
                  userId: '',
                  userName: '',
                  img: '',
                });
        // Redirect to login page or show a success message
       window.location.href = '/';
        
      } else {
        // Handle errors
        alert(result.message || 'Logout failed');
      }
    } catch (error) {
      console.log('Logout error:', error);
    }
  };
  
  return (
    <UserContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };