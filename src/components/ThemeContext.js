import React, { createContext, useContext, useState, useEffect } from 'react';
import './ThemeContext.css';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // ✅ Separate useEffect for initial load
    useEffect(() => {
        console.log('ThemeProvider mounting...');

        const saved = localStorage.getItem('todoDarkMode');
        console.log('Saved theme from localStorage:', saved);

        if (saved !== null) {
            const savedTheme = JSON.parse(saved);
            console.log('Setting theme to:', savedTheme);
            setIsDarkMode(savedTheme);
        } else {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            console.log('Using system theme:', systemDark);
            setIsDarkMode(systemDark);
        }
    }, []);

    // ✅ Separate useEffect for theme changes
    useEffect(() => {
        console.log('Theme changed to:', isDarkMode);

        localStorage.setItem('todoDarkMode', JSON.stringify(isDarkMode));

        if (isDarkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        console.log('Toggling theme from:', isDarkMode, 'to:', !isDarkMode);
        setIsDarkMode(prev => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme,
        theme: isDarkMode ? 'dark' : 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;