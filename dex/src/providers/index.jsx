import { ShortSwapProvider } from "./context";

const AllProviders = ({children}) => {
    return <ShortSwapProvider>
        {children}
    </ShortSwapProvider>
}

export default AllProviders;

export * from './context';