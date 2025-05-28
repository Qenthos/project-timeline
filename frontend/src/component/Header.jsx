import { useState } from "react";
import { NavLink } from "react-router";
import "./Header.scss";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * Show / hide menu
   */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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

          <li className="header__nav__avatar">
            <img
              src="./../../public/media/bg-home.webp"
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
                  <NavLink to="/profil" className="header__nav__dropdown-link">
                    Voir profil
                  </NavLink>
                </li>
                <li className="header__nav__dropdown-item">
                  <NavLink
                    to="/deconnexion"
                    className="header__nav__dropdown-link"
                  >
                    Se déconnecter
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </div>
      </nav>
    </header>
  );
};

export default Header;
