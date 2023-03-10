import { LongSwapProvider, ShortSwapProvider, UIProvider } from "./context";
import React, { ReactNode } from "react";

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return (
    <UIProvider>
      <ShortSwapProvider>
        <LongSwapProvider>{children}</LongSwapProvider>
      </ShortSwapProvider>
    </UIProvider>
  );
};

export default AllProviders;

export * from "./context";
