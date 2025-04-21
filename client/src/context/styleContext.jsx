import React, { createContext, useState, useEffect } from 'react';

export const StyleContext = createContext();

const defaultStyles = {
  primaryColor: 'blue-500',
  fontSize: 'text-base',
  fontFamily: 'font-sans',
  theme: 'light', // light or dark
};

export const StyleProvider = ({ children }) => {
  const [styles, setStyles] = useState(() => {
    const saved = localStorage.getItem('appStyles');
    return saved ? JSON.parse(saved) : defaultStyles;
  });

  useEffect(() => {
    localStorage.setItem('appStyles', JSON.stringify(styles));
    document.documentElement.classList.toggle('dark', styles.theme === 'dark');
  }, [styles]);

  return (
    <StyleContext.Provider value={{ styles, setStyles }}>
      {children}
    </StyleContext.Provider>
  );
};
