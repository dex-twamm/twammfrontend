import {
  LongSwapProvider,
  ShortSwapProvider,
  NetworkStateProvider,
} from "./context";
import React, { ReactNode } from "react";

interface AllProvidersProps {
  children: ReactNode;
}

const AllProviders: React.FC<AllProvidersProps> = ({ children }) => {
  return (
    <NetworkStateProvider>
      <ShortSwapProvider>
        <LongSwapProvider>{children}</LongSwapProvider>
      </ShortSwapProvider>
    </NetworkStateProvider>
  );
};

export default AllProviders;

export * from "./context";
