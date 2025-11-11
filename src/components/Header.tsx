import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/cats", label: "About Cats" }
  ];
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "60px",
        padding: "0 2rem",
  background: "linear-gradient(90deg, #f7d7a3 0%, #E99B64 100%)",
  boxShadow: "0 2px 8px rgba(168, 107, 28, 0.10)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      {/* Logo + Text */}
  <div style={{ display: "flex", alignItems: "center", gap: "0.rem" }}>
        <img
          src="/images/header-logo.png"
          alt="Site Logo"
          style={{ height: "40px", maxHeight: "100%" }}
        />
        <span style={{ fontSize: "1.2rem", fontWeight: 500, color: "#333", fontFamily: "'Ambar Pearl', cursive, sans-serif" }}>
          PurrFacts
        </span>
      </div>

      {/* Navigation on the right */}
      <nav
        style={{
          display: "flex",
          gap: "1.25rem",
          marginRight: "3rem",
          flexShrink: 0,
        }}
      >
        {navLinks.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: "none",
                color: isActive ? "#a86b1c" : "#333",
                fontWeight: 400,
                borderBottom: isActive ? "3px solid #a86b1c" : "3px solid transparent",
                paddingBottom: "4px",
                transition: "border-color 0.2s"
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}


