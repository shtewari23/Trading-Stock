import React, { createContext, useContext, useState } from 'react';

const ResContext = createContext();

export const ResProvider = ({ children }) => {
  const [res, setRes] = useState(); // Initial value of res
  const [otpRes, setOtpRes] = useState(); // Initial value of res

  return (
    <ResContext.Provider value={{ res, setRes ,otpRes, setOtpRes}}>
      {children}
    </ResContext.Provider>
  );
};

export const useRes = () => useContext(ResContext);
