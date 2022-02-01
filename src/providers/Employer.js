import React, { useContext, useEffect } from 'react';
import { useUser } from './User';

const EmployerContext = React.createContext();

export function useEmployer() {
  return useContext(EmployerContext);
}

export function EmployerProvider({ children }) {
  const { user, userData } = useUser();

  useEffect(() => console.log(user, userData), [user, userData]);

  return <EmployerContext.Provider>{children}</EmployerContext.Provider>;
}
