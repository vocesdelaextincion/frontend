import "./Navbar.css";

const NavButton = ({ label, href }) => {
  return (
    <li>
      <a href={href}>{label}</a>
    </li>
  );
};

const Navbar = () => {
  const buttons = [
    { label: "Voces de la Extinción", key: "home", href: "/" },
    { label: "Sobre el proyecto", key: "about", href: "/about/" },
    { label: "Escuchar", key: "listen", href: "/listen/" },
    { label: "¿Quiénes somos?", key: "us", href: "/us/" },
    { label: "Contacto", key: "contact", href: "/contact/" },
  ];

  return (
    <nav transition:persist>
      <ul className="navbar-list">
        {buttons.map((button) => (
          <NavButton label={button.label} key={button.key} href={button.href} />
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
