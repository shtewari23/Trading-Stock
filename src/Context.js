import React, { createContext, useContext, useState } from 'react';

const ResContext = createContext();

export const ResProvider = ({ children }) => {
  const [res, setRes] = useState(1); // Initial value of res

  return (
    <ResContext.Provider value={{ res, setRes }}>
      {children}
    </ResContext.Provider>
  );
};

export const useRes = () => useContext(ResContext);
