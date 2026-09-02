import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Activity } from 'lucide-react';
import Home from './pages/Home/Home';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={24} color="var(--primary-color)" />
              WEB III
            </div>
          </div>
          <Link to="/" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/usuarios" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} />
            Usuários
          </Link>
          <a href="/configuracoes" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} />
            Configurações
          </a>
          <a href="/sair" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', marginBottom: '1rem' }}>
            <LogOut size={20} />
            Sair
          </a>
        </aside>

        <div className="right-area">
          <nav className="top-navbar">
            <div className="navbar-right">
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {theme === 'light' ? (
                  <><Moon size={18} /></>
                ) : (
                  <><Sun size={18} /></>
                )}
              </button>
              <div className="user-profile">Administrador</div>
            </div>
          </nav>

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;