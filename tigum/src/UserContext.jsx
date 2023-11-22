import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
 const [user, setUser] = useState(null);

 useEffect(() => {
  const loggedInUser = localStorage.getItem("user");
  if (loggedInUser) {
    const foundUser = JSON.parse(loggedInUser);
    setUser(foundUser);
  }
 }, []);

 return (
  <UserContext.Provider value={{user, setUser}}>
    {children}
  </UserContext.Provider>
 );
};
