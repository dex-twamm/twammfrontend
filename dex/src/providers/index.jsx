import { LongSwapProvider, ShortSwapProvider, UIProvider } from "./context";

const AllProviders = ({ children }) => {
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
