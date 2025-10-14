import { useState } from "react";
import { Icon } from "@iconify/react";
import "./Navbar.css";

const NavButton = ({ label, href, onClick }) => {
  return (
    <li>
      <a href={href} onClick={onClick}>
        {label}
      </a>
    </li>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const buttons = [
    { label: "Voces de la Extinción", key: "home", href: "/" },
    { label: "Sobre el proyecto", key: "about", href: "/about/" },
    { label: "Escuchar", key: "listen", href: "/listen/" },
    { label: "¿Quiénes somos?", key: "us", href: "/us/" },
    { label: "Contacto", key: "contact", href: "/contact/" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav transition:persist="true" className="navbar">
        <ul className="navbar-list">
          {buttons.map((button) => (
            <NavButton
              label={button.label}
              key={button.key}
              href={button.href}
            />
          ))}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <div className="mobile-navbar">
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-menu-panel">
            <ul className="mobile-menu-list">
              {buttons.filter(button => button.key !== 'contact').map((button) => (
                <NavButton
                  label={button.label}
                  key={button.key}
                  href={button.href}
                  onClick={closeMobileMenu}
                />
              ))}
            </ul>
            <div className="mobile-menu-social">
              <a
                href="https://www.facebook.com/VocesDeLaExtincion"
                className="mobile-social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:facebook" />
              </a>
              <a
                href="https://www.instagram.com/vocesdelaextincion/"
                className="mobile-social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon icon="mdi:instagram" />
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
