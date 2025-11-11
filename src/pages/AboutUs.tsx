import { useState, useEffect } from "react";

interface Developer {
  id: number;
  name: string;
  role: string;
  github?: string;
  bio?: string;
  catName?: string;
  catBreed?: string;
  profile_image?: string; // from DB (stored as path like /uploads/developers/image.jpg)
}

export default function AboutUs() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const API_URL = `${import.meta.env.VITE_API_URL}/developers`;
        const response = await fetch(API_URL);
        const data = await response.json();
        setDevelopers(data);
      } catch (error) {
        console.error("Failed to fetch developers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <main style={{ marginTop: "80px", minHeight: "80vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            color: "#a86b1c",
            fontSize: "2.5rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Meet Our Developers
        </h1>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1rem" }}>
            We're a passionate team of developers and cat lovers who combine
            technology and creativity to bring unique feline experiences to life.
          </p>
          <p style={{ fontSize: "1rem", color: "#666" }}>
            Each of us has our own purrfect inspiration — our beloved cats!
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.2rem", color: "#a86b1c" }}>Loading...</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            {developers.map((dev) => (
              <div
                key={dev.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  border: "2px solid #f7d7a3",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0,0,0,0.1)";
                }}
              >
                {/* Developer Profile */}
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <img
                    src={
                      dev.profile_image
                        ? `http://127.0.0.1:5050${dev.profile_image}`
                        : "/images/default-avatar.png"
                    }
                    alt={dev.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #a86b1c",
                      marginBottom: "1rem",
                    }}
                  />
                  <h3
                    style={{
                      color: "#a86b1c",
                      marginBottom: "0.5rem",
                      fontSize: "1.4rem",
                    }}
                  >
                    {dev.name}
                  </h3>
                  <p
                    style={{
                      color: "#E99B64",
                      fontWeight: 600,
                      marginBottom: "1rem",
                    }}
                  >
                    {dev.role}
                  </p>
                  {dev.github && (
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#007bff",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                      }}
                    >
                      {dev.github}
                    </a>
                  )}
                </div>

                {/* Bio */}
                {dev.bio && (
                  <p
                    style={{
                      color: "#333",
                      lineHeight: "1.6",
                      marginBottom: "1.5rem",
                      textAlign: "center",
                    }}
                  >
                    {dev.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Company Mission */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "2.5rem",
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            border: "2px solid #f7d7a3",
          }}
        >
          <h2 style={{ color: "#a86b1c", marginBottom: "1.5rem" }}>
            Our Mission
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#333",
              lineHeight: "1.7",
              marginBottom: "1rem",
            }}
          >
            At PurrFacts, we believe that cats are more than just pets—they're
            family, teachers, and sources of endless wonder. Our mission is to
            celebrate the magic of cats through interactive experiences that
            educate, entertain, and bring joy to fellow cat lovers around the
            world.
          </p>
          <p
            style={{
              fontSize: "1rem",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            "Every cat has a story to tell, and every purr holds a secret worth
            discovering."
          </p>
        </div>
      </div>
    </main>
  );
}
