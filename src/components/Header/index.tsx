// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header style={{ 
      backgroundColor: 'var(--primary-color, #1a1a2e)', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        Import Control
      </div>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <Link 
          to="/dashboard" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            borderBottom: location.pathname === '/dashboard' ? '2px solid #00f2fe' : 'none'
          }}
        >
          Dashboard
        </Link>
        <Link 
          to="/process" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            borderBottom: location.pathname.includes('/process') ? '2px solid #00f2fe' : 'none'
          }}
        >
          Novo Processo
        </Link>
        
      </nav>
    </header>
  );
};

export default Header;