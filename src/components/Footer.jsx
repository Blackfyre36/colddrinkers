import { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <footer>
      <p>
        <span className="text-gradient">COLDCAFF </span> was made by<a target="_blank" href="http://localhost:5173/"> Blackfyre36</a> <br />Check out the project on<a target="_blank" href="https://github.com/dashboard"> GitHub</a>!
      </p>
      <button onClick={toggleTheme}>
        Change theme for your preference.
      </button>
    </footer>
  );
}












