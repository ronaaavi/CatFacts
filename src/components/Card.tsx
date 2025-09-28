interface CardProps {
  fact: string;
  open: boolean;
  image?: string;
  onClick?: () => void;
}

export default function Card({ fact, open, image, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        perspective: "1000px",
        width: "260px",
        height: "260px",
        margin: "1rem",
        cursor: open ? "default" : "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.6s cubic-bezier(.68,-0.55,.27,1.55)",
          transformStyle: "preserve-3d",
          transform: open ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Card Front (with cat image cover) */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            border: "2px solid #6e4b13ff",
            overflow: "hidden",
          }}
        >
          {image && (
            <img
              src={image}
              alt="Cat Cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Card Back (fact revealed) */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #fffbe6 60%, #ffe4e1 100%)",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: "#333",
            border: "2px solid #6e4b13ff",
            transform: "rotateY(180deg)",
            padding: "1rem",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          <span role="img" aria-label="cat" style={{ fontSize: "2rem" }}>
          </span>
          <p style={{ marginTop: "0.8rem" }}>{fact}</p>
        </div>
      </div>
    </div>
  );
}
