import { LongSwapProvider, ShortSwapProvider, UIProvider } from "./context";
import { WebProvider } from "./context/WebProvider";

const AllProviders = ({ children }) => {
  return (
    <WebProvider>
      <UIProvider>
        <ShortSwapProvider>
          <LongSwapProvider>{children}</LongSwapProvider>
        </ShortSwapProvider>
      </UIProvider>
    </WebProvider>
  );
};

export default AllProviders;

export * from "./context";
