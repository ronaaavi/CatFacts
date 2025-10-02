export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        padding: "1.5rem 2rem",
        background: "#f7d7a3",
        textAlign: "center",
        marginTop: "3rem",
        color: "#5c3a00",
        fontSize: "1rem",
      }}
    >
      &copy; {new Date().getFullYear()} Purr Facts. All rights reserved.
    </footer>
  );
}