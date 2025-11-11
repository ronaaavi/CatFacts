import { useState, useEffect } from "react";

interface Cat {
  id: number;
  name: string;
  age: number;
  image_url: string;
  breed_name: string;
  breed_description: string;
}

export default function AboutCats() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/cats`;
        const response = await fetch(API_URL);
        const data = await response.json();
        setCats(data);
      } catch (error) {
        console.error("Failed to fetch cats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const displayedCats = showAll ? cats : cats.slice(0, 12);

  const filteredCats = displayedCats.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.breed_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main style={{ marginTop: "80px", minHeight: "80vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            color: "#a86b1c",
            fontSize: "2.5rem",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Meet Our Lovely Cats
        </h1>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1rem" }}>
            Explore the adorable cats in our page! Learn their names, breeds,
            and unique characteristics.
          </p>

          {/* Search bar */}
          <div style={{ marginTop: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                borderRadius: "25px",
                border: "2px solid #f7d7a3",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                outline: "none",
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.2rem", color: "#a86b1c" }}>Loading cats...</p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              {filteredCats.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCat(cat)}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    border: "2px solid #f7d7a3",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    src={cat.image_url || "/images/cat-icon.png"}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #f7d7a3",
                      marginBottom: "1rem",
                    }}
                  />
                  <h3
                    style={{
                      color: "#a86b1c",
                      marginBottom: "0.5rem",
                      fontSize: "1.3rem",
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    <strong>Breed:</strong> {cat.breed_name}
                  </p>
                  <p
                    style={{
                      color: "#333",
                      fontSize: "0.9rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {cat.breed_description.length > 100
                      ? `${cat.breed_description.substring(0, 100)}...`
                      : cat.breed_description}
                  </p>
                </div>
              ))}
            </div>

            {!searchTerm && (
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    background: "#E99B64",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 2rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {showAll ? "Show Less" : `Show All ${cats.length} Cats`}
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {selectedCat && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "2rem",
            }}
            onClick={() => setSelectedCat(null)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "600px",
                maxHeight: "80vh",
                overflow: "auto",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCat(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
              <img
                src={selectedCat.image_url || "/images/cat-icon.png"}
                alt={selectedCat.name}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "3px solid #f7d7a3",
                  marginBottom: "1rem",
                }}
              />
              <h2 style={{ color: "#a86b1c", marginBottom: "1rem" }}>
                {selectedCat.name}
              </h2>
              <p>
                <strong>Breed:</strong> {selectedCat.breed_name}
              </p>
              <p>
                <strong>Age:</strong> {selectedCat.age} years
              </p>
              <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
                {selectedCat.breed_description}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
