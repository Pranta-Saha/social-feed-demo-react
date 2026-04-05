import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FeedHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
      <div className="container _custom_container _feed_header_container">
        <div className="_logo_wrap">
          <a className="navbar-brand" href="/feed">
            <img
              src="/assets/images/logo.svg"
              alt="Logo"
              className="_nav_logo"
            />
          </a>
        </div>
        <div className="_feed_header_right">
          <span className="_welcome_text">Welcome, {user?.firstName}!</span>
          <button onClick={handleLogout} className="_logout_button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FeedHeader;
