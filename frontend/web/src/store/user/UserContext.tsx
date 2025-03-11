import React from 'react';
import { User } from './index';

export const UserContext = React.createContext<User>(new User());

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user] = React.useState(new User());

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};