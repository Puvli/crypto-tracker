import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/firebase';

export default function Nav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-logo">CryptoTracker</NavLink>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
            Market
          </NavLink>
          {user && (
            <NavLink to="/favorites" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Favorites
            </NavLink>
          )}
        </div>
        <div className="nav-user">
          {user ? (
            <>
              <div className="nav-avatar">{user.email?.[0]?.toUpperCase() || '?'}</div>
              <button className="btn btn-ghost" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary">Sign In</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
