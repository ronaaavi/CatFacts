export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "60px",
        padding: "0 2rem",
        background: "#f7d7a3",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      {/* Logo + Text */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img
          src="/images/catmeow-logo.png"
          alt="Site Logo"
          style={{ height: "40px", maxHeight: "100%" }}
        />
        <span style={{ fontSize: "1.2rem", fontWeight: 500, color: "#333" }}>
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
        <a
          href="/"
          style={{ textDecoration: "none", color: "#333", fontWeight: 400 }}
        >
          Home
        </a>
        <a
          href="/about"
          style={{ textDecoration: "none", color: "#333", fontWeight: 400 }}
        >
          About Us
        </a>
        <a
          href="/cats"
          style={{ textDecoration: "none", color: "#333", fontWeight: 400 }}
        >
          About Cats
        </a>
      </nav>
    </header>
  );
}


