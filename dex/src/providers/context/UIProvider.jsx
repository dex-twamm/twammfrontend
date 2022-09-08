import { createContext, useState } from 'react';

const UIContext = createContext(null);

const UIProvider = ({ children }) => {
	const [showDropdown, setShowDropdown] = useState(false);

	return (
		<UIContext.Provider
			value={{
				showDropdown,
				setShowDropdown,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};

export { UIProvider, UIContext };
