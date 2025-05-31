import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useUsersStore } from "./../stores/useStore";
import "./Header.scss";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const usersStore = useUsersStore();
  let navigate = useNavigate();

  /**
   * Open / close menu
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  /**
   * Logout
   */
  const handleLogout = () => {
    usersStore.logout();
    navigate("/");
  };

  const isConnected = usersStore.currentUser !== null;

  return (
    <header className="header">
      <nav className="header__nav" aria-label="Navigation principale">
        <NavLink to="/" className="header__nav-item header__nav-item--home">
          Timeline
        </NavLink>

        <div className="header__nav__group">
          <NavLink
            to="/ranking"
            className="header__nav__item header__nav__item--ranking"
          >
            Classement
          </NavLink>

          {isConnected ? (
            <li className="header__nav__avatar">
              <img
                src={
                  usersStore.currentUser.profilePicture &&
                  "./../../public/media/piano-bg.jpg"
                }
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
                      onClick={() => setMenuOpen(false)}
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
          ) : (
            <>
              <NavLink
                to="/login"
                className="header__nav__item header__nav__item--login"
              >
                Connexion
              </NavLink>
              <NavLink
                to="/register"
                className="header__nav__item header__nav__item--signup"
              >
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
