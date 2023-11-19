import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    const foundUser = JSON.parse(loggedInUser);
    setUser(foundUser);
    setIsLoading(false);
  }
 }, []);

 if (isLoading) {
  return <div>Loading...</div>;
 }

 return (
  <UserContext.Provider value={user}>
    {children}
  </UserContext.Provider>
 );
};
