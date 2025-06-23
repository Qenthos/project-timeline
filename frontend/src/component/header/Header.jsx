import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useUsersStore } from "../../stores/useStore";
import "./Header.scss";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const usersStore = useUsersStore();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  /**
   * Logout a current user
   */
  const handleLogout = () => {
    usersStore.logout();
    navigate("/");
    setMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isConnected = usersStore.currentUser !== null;

  return (
    <header className="header">
      <nav className="header__nav" aria-label="Navigation principale">
        <NavLink to="/" className="header__nav-logo">
          Timeline
        </NavLink>

        {isConnected && (
          <div className="header__nav__avatar header__nav__avatar--mobile">
            <img
              src={usersStore.currentUser.pfpUrl}
              alt="Mon profil"
              className="header__nav__avatar-img"
              onClick={toggleMenu}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
            />
            {menuOpen && (
              <ul className="header__nav__dropdown">
                <li className="header__nav__dropdown-item">
                  <NavLink
                    to="/profil"
                    className="header__nav__dropdown-link"
                    onClick={() => {
                      setMenuOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Voir profil
                  </NavLink>
                </li>
                <li className="header__nav__dropdown-item">
                  <button
                    className="header__nav__dropdown-link"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        <button
          className="header__burger"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileMenuOpen}
        >
          <img
            src={
              mobileMenuOpen
                ? "/media/icones/close-menu-burger.svg"
                : "/media/icones/icon-menu-burger.svg"
            }
            alt=""
            className="header__burger-icon"
          />
        </button>

        <ul
          className={`header__nav__list ${
            mobileMenuOpen ? "header__nav__list--open" : ""
          }`}
        >
          <li className="header__nav__item">
            <NavLink
              className="header__nav__link header__nav__item--ranking"
              to="/ranking"
              onClick={() => setMobileMenuOpen(false)}
            >
              Classement
            </NavLink>
          </li>

          {!isConnected && (
            <>
              <li className="header__nav__item ">
                <NavLink
                  className=" header__nav__link header__nav__item--login"
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </NavLink>
              </li>
              <li className="header__nav__item">
                <NavLink
                  className="header__nav__link header__nav__item--signup"
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inscription
                </NavLink>
              </li>
            </>
          )}

          {isConnected && (
            <li className="header__nav__avatar header__nav__avatar--desktop">
              <img
                src={usersStore.currentUser.pfpUrl}
                alt="Mon profil"
                className="header__nav__avatar-img"
                onClick={toggleMenu}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
              />
              {menuOpen && (
                <ul className="header__nav__dropdown">
                  <li className="header__nav__dropdown-item">
                    <NavLink
                      to="/profil"
                      className="header__nav__dropdown-link"
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Voir profil
                    </NavLink>
                  </li>
                  <li className="header__nav__dropdown-item">
                    <button
                      className="header__nav__dropdown-link"
                      onClick={handleLogout}
                    >
                      Se déconnecter
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
