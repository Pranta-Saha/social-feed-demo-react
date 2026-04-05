import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FeedHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
      <div className="container _custom_container">
        <div className="_logo_wrap">
          <a className="navbar-brand" href="/feed">
            <img src="/assets/images/logo.svg" alt="Logo" className="_nav_logo" />
          </a>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--color)' }}>
            Welcome, {user?.firstName}!
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'var(--color5)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FeedHeader;
