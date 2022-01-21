import React, { useContext, useState } from 'react';

const SupervisorContext = React.createContext();

export function useSupervisor() {
  return useContext(SupervisorContext);
}

export function SupervisorProvider({ children }) {
  const [supervisorLoaded, setSupervisorLoaded] = useState(false);

  return (
    <SupervisorContext.Provider value={{}}>
      {supervisorLoaded && children}
    </SupervisorContext.Provider>
  );
}
