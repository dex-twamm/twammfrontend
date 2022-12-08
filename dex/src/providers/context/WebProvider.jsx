import React, { useState } from "react";

export const WebProvider = ({ children }) => {
  const [provider, setProvider] = useState("");

  return (
    <WebContext.Provider
      value={{
        provider,
        setProvider,
      }}
    >
      {children}
    </WebContext.Provider>
  );
};

export const WebContext = React.createContext();
