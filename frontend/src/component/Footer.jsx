import React from "react";
import { Link } from "react-router";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="footer__nav">
        <ul className="footer__nav-list">
          <li className="footer__nav-item">
            {" "}
            <Link to="/mentions-legales" className="footer__link">
              Mentions légales
            </Link>
          </li>
          <li>
            {" "}
            <Link to="/politique-confidentialite" className="footer__link">
              Politique de confidentialité
            </Link>
          </li>
        </ul>
      </nav>
      <p className="footer__copyright">© 2025</p>
    </footer>
  );
};

export default Footer;
