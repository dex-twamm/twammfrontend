import { LongSwapProvider, ShortSwapProvider } from "./context";

const AllProviders = ({ children }) => {
  return (
    <ShortSwapProvider>
      <LongSwapProvider>{children}</LongSwapProvider>
    </ShortSwapProvider>
  );
};

export default AllProviders;

export * from "./context";
