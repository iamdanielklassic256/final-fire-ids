import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext({
	isDarkMode: false,
	toggleTheme: () => { },
	theme: {},
});

export const ThemeProvider = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const lightTheme = {
		background: '#f3f4f6',
		surface: '#ffffff',
		primary: '#cb4523',
		primaryLight: '#fff1ef',
		text: '#1f2937',
		textSecondary: '#4b5563',
		border: '#e5e7eb',
	};

	const darkTheme = {
		background: '#111827',
		surface: '#1f2937',
		primary: '#cb4523',
		primaryLight: '#481912',
		text: '#ffffff',
		textSecondary: '#9ca3af',
		border: '#374151',
	};

	const toggleTheme = () => {
		setIsDarkMode(prevMode => !prevMode);
	};

	const theme = isDarkMode ? darkTheme : lightTheme;

	return (
		<ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
			{children}
		</ThemeContext.Provider>
	);
};

// Custom hook to use theme
export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}; 