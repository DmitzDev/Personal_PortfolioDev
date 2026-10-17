import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 
           localStorage.getItem('theme') || 
           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#0a0f1d' : '#eef2f6');
    }
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }));
  }, []);

  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.detail);
    };

    window.addEventListener('theme-changed', handleThemeChange);
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0f1d' : '#eef2f6');
    }

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange);
    };
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    changeTheme(newTheme);
  }, [theme, changeTheme]);

  return { theme, toggleTheme, changeTheme, setTheme: changeTheme };
}

