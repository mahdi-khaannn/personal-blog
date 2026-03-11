import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  const applyTheme = (nextIsDark: boolean) => {
    document.documentElement.classList.toggle('dark', nextIsDark);
    document.documentElement.dataset.theme = nextIsDark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = nextIsDark ? 'dark' : 'light';
  };

  useEffect(() => {
    // Check initial state from the class we set in head
    setIsDark(document.documentElement.classList.contains('dark'));

    // Optional: listen to system changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    applyTheme(nextIsDark);
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-[var(--text-color)] hover:bg-[var(--surface-color)] transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-color)] group"
      aria-label="Toggle Dark Mode"
    >
      <div className="transition-transform duration-500 group-hover:rotate-180">
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </div>
    </button>
  );
}
