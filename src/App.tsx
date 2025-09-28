import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import "./App.css";

const CARD_COUNT = 12;

function App() {
  const [cardStates, setCardStates] = useState(
    Array.from({ length: CARD_COUNT }, () => ({
      open: false,
      fact: "",
      image: "",
    }))
  );

  const AUTO_CLOSE_DELAY = 1000;

  // Fetch random cat images for covers when app loads
  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch(
          `https://api.thecatapi.com/v1/images/search?limit=${CARD_COUNT}&size=small`
        );
        const data = await res.json();

        const images = data.map((img: any) => img.url || "");
        setCardStates((prev) =>
          prev.map((card, idx) => ({ ...card, image: images[idx] }))
        );
      } catch (err) {
        console.error("❌ Failed to fetch cat images:", err);
      }
    }

    fetchImages();
  }, []);

  const handleCardClick = async (idx: number) => {
    if (cardStates[idx].open) return;
    const newStates = [...cardStates];

    try {
      const response = await fetch("https://meowfacts.herokuapp.com/");
      const data = await response.json();
      newStates[idx].fact = data.data[0];
      newStates[idx].open = true;
      setCardStates(newStates);
      setTimeout(() => handleCardReset(idx), AUTO_CLOSE_DELAY);
    } catch {
      newStates[idx].fact = "Failed to fetch cat fact.";
      newStates[idx].open = true;
      setCardStates(newStates);
      setTimeout(() => handleCardReset(idx), AUTO_CLOSE_DELAY);
    }
  };

  const handleCardReset = (idx: number) => {
    const newStates = [...cardStates];
    newStates[idx] = { ...newStates[idx], open: false, fact: "" };
    setCardStates(newStates);
  };

  return (
    <>
      <Header />
      <main style={{ marginTop: "80px", minHeight: "80vh", textAlign: "center" }}>
        {/* Mystical Cat Wisdom pill */}
        <div
          style={{
            margin: "1rem auto 0.5rem auto",
            display: "inline-block",
            background: "#fff",
            borderRadius: "2rem",
            padding: "0.5rem 2rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          Mystical Cat Wisdom
        </div>

        {/* PurrFacts title */}
        <div
          style={{
            fontWeight: 700,
            fontSize: "2.5rem",
            color: "#a86b1c",
            margin: "0.5rem 0",
            fontFamily: "'Luckiest Guy', cursive, sans-serif",
          }}
        >
          PurrFacts
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 400,
            color: "#222",
            maxWidth: "600px",
            margin: "0 auto 1rem auto",
            lineHeight: "1.6",
          }}
        >
          Discover Enchanting Cat Wisdom Through Mystical Tarot-Style Cards. Each
          Flip Reveals A Magical Feline Fact And Adorable Companion.
        </div>

        {/* Button */}
        <button
          style={{
            marginBottom: "2rem",
            background: "#E99B64",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1.5rem",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          More Facts? Meow!
        </button>

        {/* Card grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem",
            justifyItems: "center",
            marginTop: "2rem",
          }}
        >
          {cardStates.map((card, idx) => (
            <Card
              key={idx}
              fact={card.fact}
              open={card.open}
              image={card.image}
              onClick={() => handleCardClick(idx)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
