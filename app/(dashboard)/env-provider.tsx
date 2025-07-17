'use client';

import { Environment } from 'app/types/common';
import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';



const EnvironmentContext = createContext({
  environment: Environment.Prod,
/* eslint-disable @typescript-eslint/no-unused-vars */
  setEnvironment: (_env: Environment) => {},
});

// Custom hook to use the environment
export function useEnvironment() {
  return useContext(EnvironmentContext);
}

// Environment Provider component
export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environment, setEnvironmentState] = useState<Environment>(Environment.Prod);
  const [isLoading, setIsLoading] = useState(true);

  // Load environment from localStorage on mount
  useEffect(() => {
    const savedEnv = localStorage.getItem('selectedEnvironment');
    if (savedEnv && (
      savedEnv === Environment.Dev || 
      savedEnv === Environment.Uat || 
      savedEnv === Environment.Prod
    )) {
      setEnvironmentState(savedEnv as Environment);
    }
    setIsLoading(false);
  }, []);

  // Function to update environment
  const setEnvironment = (env: Environment) => {
    setEnvironmentState(env);
    localStorage.setItem('selectedEnvironment', env);
    console.log('Environment changed to:', env);
  };

  if (isLoading) {
    return null;  
  }

  return (
    <EnvironmentContext.Provider value={{ environment, setEnvironment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}