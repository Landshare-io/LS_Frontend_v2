import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


interface SwitchThemeProps {
  className?: string;
}

export default function SwitchTheme({ className }: SwitchThemeProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("land-v2-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className={`theme-switch ${theme === "dark" ? "theme-switch--dark" : ""} ${className}`}
    >
      <div className="theme-switch-thumb">
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="theme-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="theme-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2m0 18v2M4 4l2 2m12 12 2 2M1 12h2m18 0h2M4 20l2-2M18 6l2-2" />
          </svg>
        )}
      </div>
    </button>
  );
}
