import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { paths } from "../../routes/paths";
import { useSettings } from "../../contexts/SettingsContext";
import logoBOA from "../../assets/logoBOA.jpeg";
import "./Header.css";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ onToggleSidebar, sidebarOpen }: HeaderProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useSettings();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(paths.login);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.email) {
      return currentUser.email.split("@")[0];
    }
    return "Usuário";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__left">
          <button
            onClick={onToggleSidebar}
            className="header__menu-toggle"
            aria-label="Toggle sidebar"
            title={sidebarOpen ? t('closeMenu') : t('openMenu')}
          >
            {sidebarOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <div className="header__logo">
            <img src={logoBOA} alt="BOA Logo" />
          </div>
        </div>

        <div className="header__right">
          <div className="header__profile" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="header__profile-button"
              aria-label="Menu do perfil"
            >
              <div className="header__profile-avatar">
                {getUserInitials()}
              </div>
              <span className="header__profile-name">{getUserDisplayName()}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`header__profile-arrow ${
                  profileMenuOpen ? "header__profile-arrow--open" : ""
                }`}
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {profileMenuOpen && (
              <div className="header__profile-menu">
                <div className="header__profile-menu-header">
                  <div className="header__profile-menu-avatar">
                    {getUserInitials()}
                  </div>
                  <div className="header__profile-menu-info">
                    <div className="header__profile-menu-name">
                      {getUserDisplayName()}
                    </div>
                    {currentUser?.email && (
                      <div className="header__profile-menu-email">
                        {currentUser.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="header__profile-menu-divider"></div>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    navigate(paths.perfil);
                  }}
                  className="header__profile-menu-item"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('myProfile')}
                </button>
                <div className="header__profile-menu-divider"></div>
                <button
                  onClick={handleLogout}
                  className="header__profile-menu-item header__profile-menu-item--danger"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 16L21 12M21 12L17 8M21 12H7M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t('signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
