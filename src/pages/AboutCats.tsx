import { useState, useEffect } from "react";

interface CatBreed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  origin: string;
  life_span: string;
  weight: {
    metric: string;
  };
  image?: {
    url: string;
  };
}

export default function AboutCats() {
  const [breeds, setBreeds] = useState<CatBreed[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreed, setSelectedBreed] = useState<CatBreed | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        // Fetch breeds with images
        const response = await fetch('https://api.thecatapi.com/v1/breeds');
        const data = await response.json();
        
        // Fetch images for each breed
        const breedsWithImages = await Promise.all(
          data.map(async (breed: CatBreed) => {
            try {
              const imageResponse = await fetch(
                `https://api.thecatapi.com/v1/images/search?breed_ids=${breed.id}&limit=1`
              );
              const imageData = await imageResponse.json();
              return {
                ...breed,
                image: imageData[0] || null
              };
            } catch {
              return breed; // Return breed without image if fetch fails
            }
          })
        );
        
        setBreeds(breedsWithImages);
      } catch (error) {
        console.error('Failed to fetch cat breeds:', error);
      } finally {
        setLoading(false);

      }
    };

    fetchBreeds();
  }, []);

  const displayedBreeds = showAll ? breeds : breeds.slice(0, 12);

  return (
    <main style={{ marginTop: "80px", minHeight: "80vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#a86b1c", fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center" }}>
          About Cats & Breeds
        </h1>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1rem" }}>
            Discover the fascinating world of cats! There are over 67 recognized cat breeds, 
            each with unique characteristics, temperaments, and origins.
          </p>
          <p style={{ fontSize: "1rem", color: "#666" }}>
            Click on any breed below to learn more about these amazing felines.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.2rem", color: "#a86b1c" }}>Loading cat breeds....</p>
          </div>
        ) : (
          <>
            {/* Breed Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem"
            }}>
              {displayedBreeds.map((breed) => (
                <div
                  key={breed.id}
                  onClick={() => setSelectedBreed(breed)}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    border: "2px solid #f7d7a3"
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
                  {/* Breed Image */}
                  {breed.image?.url && (
                    <div style={{ marginBottom: "1rem" }}>
                      <img
                        src={breed.image.url}
                        alt={breed.name}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #f7d7a3"
                        }}
                      />
                    </div>
                  )}
                  
                  <h3 style={{ color: "#a86b1c", marginBottom: "0.5rem", fontSize: "1.3rem" }}>
                    {breed.name}
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    <strong>Origin:</strong> {breed.origin}
                  </p>
                  <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                    <strong>Lifespan:</strong> {breed.life_span} years
                  </p>
                  <p style={{ color: "#333", fontSize: "0.95rem", lineHeight: "1.4" }}>
                    {breed.description.length > 100 
                      ? `${breed.description.substring(0, 100)}...` 
                      : breed.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
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
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#d48a2f"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#E99B64"}
              >
                {showAll ? `Show Less` : `Show All ${breeds.length} Breeds`}
              </button>
            </div>
          </>
        )}

        {/* Breed Detail Modal */}
        {selectedBreed && (
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
              padding: "2rem"
            }}
            onClick={() => setSelectedBreed(null)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "600px",
                maxHeight: "80vh",
                overflow: "auto",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedBreed(null)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                ✕
              </button>
              
              {/* Breed Image in Modal */}
              {selectedBreed.image?.url && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <img
                    src={selectedBreed.image.url}
                    alt={selectedBreed.name}
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "3px solid #f7d7a3"
                    }}
                  />
                </div>
              )}
              
              <h2 style={{ color: "#a86b1c", marginBottom: "1rem" }}>
                {selectedBreed.name}
              </h2>
              
              <div style={{ marginBottom: "1rem" }}>
                <p><strong>Origin:</strong> {selectedBreed.origin}</p>
                <p><strong>Lifespan:</strong> {selectedBreed.life_span} years</p>
                <p><strong>Weight:</strong> {selectedBreed.weight.metric} kg</p>
                <p><strong>Temperament:</strong> {selectedBreed.temperament}</p>
              </div>
              
              <p style={{ lineHeight: "1.6", color: "#333" }}>
                {selectedBreed.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}