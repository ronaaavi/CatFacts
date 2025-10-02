import { useState, useEffect } from "react";

interface Developer {
  id: number;
  name: string;
  role: string;
  bio: string;
  catName: string;
  catBreed: string;
  profileImage: string;
  catImage: string;
}

export default function AboutUs() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using local images instead of fetching from API
    const devData: Developer[] = [
      {
        id: 1,
        name: "Rona Arbe Limbago",
        role: "Lead Frontend Developer",
        bio: "Rona is a passionate React developer who loves creating beautiful user interfaces. When she's not coding, she enjoys spending time with her baby, Munchkin.",
        catName: "Munchkin",
        catBreed: "Persian",
        profileImage: "/images/arbe.jpg",
        catImage: "/images/munchkin.png", 
      },
      {
        id: 2,
        name: "Anna Alleah Jane Lindo",
        role: "Backend Developer",
        bio: "Anna specializes in building robust APIs and databases. Her cat Luna is his coding companion and loves to sit on her lap during late-night debugging sessions.",
        catName: "Luna",
        catBreed: "Persian", 
        profileImage: "/images/kai.png",
        catImage: "/images/luna.png",
      }
    ];
    
    setDevelopers(devData);
    setLoading(false);
  }, []);

  return (
    <main style={{ marginTop: "80px", minHeight: "80vh", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#a86b1c", fontSize: "2.5rem", marginBottom: "1rem", textAlign: "center" }}>
          Meet Our Duo
        </h1>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#333", marginBottom: "1rem" }}>
            We're a passionate duo of developers and cat lovers who believe in combining 
            technology with our love for felines to create magical experiences.
          </p>
          <p style={{ fontSize: "1rem", color: "#666" }}>
            Both of us have furry companions who inspire our work every day! 
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ fontSize: "1.2rem", color: "#a86b1c" }}>Loading........ </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem"
          }}>
            {developers.map((dev) => (
              <div
                key={dev.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  border: "2px solid #f7d7a3",
                  transition: "transform 0.3s, box-shadow 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
                }}
              >
                {/* Developer Profile */}
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <img
                    src={dev.profileImage}
                    alt={dev.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #a86b1c",
                      marginBottom: "1rem"
                    }}
                  />
                  <h3 style={{ color: "#a86b1c", marginBottom: "0.5rem", fontSize: "1.4rem" }}>
                    {dev.name}
                  </h3>
                  <p style={{ color: "#E99B64", fontWeight: 600, marginBottom: "1rem" }}>
                    {dev.role}
                  </p>
                </div>

                {/* Cat Section */}
                <div style={{ 
                  background: "#fef9f3", 
                  borderRadius: "12px", 
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                  border: "1px solid #f7d7a3"
                }}>
                  <h4 style={{ color: "#a86b1c", marginBottom: "1rem", textAlign: "center" }}>
                    Meet {dev.catName} 
                  </h4>
                  {dev.catImage && (
                    <img
                      src={dev.catImage}
                      alt={dev.catName}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                        border: "2px solid #f7d7a3"
                      }}
                    />
                  )}
                  <p style={{ color: "#666", fontSize: "0.9rem", textAlign: "center" }}>
                    <strong>{dev.catBreed}</strong> • Coding Companion
                  </p>
                </div>

                {/* Bio */}
                <p style={{ color: "#333", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  {dev.bio}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Company Mission */}
        <div style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "2.5rem",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          border: "2px solid #f7d7a3"
        }}>
          <h2 style={{ color: "#a86b1c", marginBottom: "1.5rem" }}>Our Mission</h2>
          <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: "1.7", marginBottom: "1rem" }}>
            At PurrFacts, we believe that cats are more than just pets—they're family, teachers, 
            and sources of endless wonder. Our mission is to celebrate the magic of cats through 
            interactive experiences that educate, entertain, and bring joy to fellow cat lovers around the world.
          </p>
          <p style={{ fontSize: "1rem", color: "#666", fontStyle: "italic" }}>
            "Every cat has a story to tell, and every purr holds a secret worth discovering." 
          </p>
        </div>
      </div>
    </main>
  );
}