export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        padding: "1rem 2rem",
        background: "#f7d7a3 ",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      &copy; {new Date().getFullYear()} Purr Facts. All rights reserved.
    </footer>
  );
}