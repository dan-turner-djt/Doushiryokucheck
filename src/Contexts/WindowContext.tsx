import React from "react";
import { useCallback, useEffect, useState } from 'react';

export type WindowContextProps = {
  clientHeight: number | undefined;
  clientWidth: number | undefined;
};

export const WindowContext = React.createContext<WindowContextProps>({ clientHeight: 0, clientWidth: 0, });

export type WindowContextProviderProps = {
  children: React.ReactNode;
};

export const WindowContextProvider: React.FC<WindowContextProviderProps> = ({ children }) => {
  const getVh = useCallback(() => {
    return window.visualViewport?.height;
  }, []);
  const getVw = useCallback(() => {
    return window.visualViewport?.width;
  }, []);

  const [clientHeight, setVh] = useState<number | undefined>(getVh());
  const [clientWidth, setVw] = useState<number | undefined>(getVw());

  useEffect(() => {
    const handleResize = () => {
      setVh(getVh());
      setVw(getVw());
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getVh, getVw]);
  
  return (
    <WindowContext.Provider value={{ clientHeight, clientWidth, }}>
      {children}
    </WindowContext.Provider>
  );
};