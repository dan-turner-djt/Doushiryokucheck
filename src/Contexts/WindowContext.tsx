import React from "react";

export type WindowContextProps = {
  clientHeight: number | undefined;
  clientWidth: number | undefined;
};

export const WindowContext = React.createContext<WindowContextProps>({ clientHeight: 0, clientWidth: 0, });

export type WindowContextProviderProps = {
  children: React.ReactNode;
};

export const WindowContextProvider: React.FC<WindowContextProviderProps> = ({ children }) => {
  const getVh = React.useCallback(() => {
    return window.visualViewport?.height;
  }, []);
  const getVw = React.useCallback(() => {
    return window.visualViewport?.width;
  }, []);

  const [clientHeight, setVh] = React.useState<number | undefined>(getVh());
  const [clientWidth, setVw] = React.useState<number | undefined>(getVw());

  React.useEffect(() => {
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