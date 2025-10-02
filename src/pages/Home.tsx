import { useState, useEffect, useRef } from "react";
import Card from "../components/Card";

const CARD_COUNT = 12;

export default function Home() {
  const [cardStates, setCardStates] = useState(
    Array.from({ length: CARD_COUNT }, () => ({
      open: false,
      fact: "",
      image: "",
    }))
  );

  // Show the fact for 5 seconds before auto-closing
  const AUTO_CLOSE_DELAY = 5000;
  const timersRef = useRef<(number | null)[]>(new Array(CARD_COUNT).fill(null));

  // Fetch random cat images when component loads
  useEffect(() => {
    const fetchCatImages = async () => {
      try {
        const response = await fetch(
          `https://api.thecatapi.com/v1/images/search?limit=${CARD_COUNT}&size=med`
        );
        const data = await response.json();
        
        console.log(`Requested ${CARD_COUNT} images, received ${data.length} images`);
        
        const newStates = [...cardStates];
        
        // If we didn't get enough images, make additional requests
        if (data.length < CARD_COUNT) {
          const additionalNeeded = CARD_COUNT - data.length;
          const additionalResponse = await fetch(
            `https://api.thecatapi.com/v1/images/search?limit=${additionalNeeded}&size=med`
          );
          const additionalData = await additionalResponse.json();
          data.push(...additionalData);
        }
        
        data.forEach((img: any, idx: number) => {
          if (idx < CARD_COUNT) {
            newStates[idx].image = img.url;
          }
        });
        setCardStates(newStates);
      } catch (error) {
        console.error('Failed to fetch cat images:', error);
      }
    };

    fetchCatImages();
  }, []); 

  
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  const handleCardClick = async (idx: number) => {
    if (cardStates[idx].open) return;
    
    // Clear any existing timer for this card
    if (timersRef.current[idx]) {
      clearTimeout(timersRef.current[idx]!);
      timersRef.current[idx] = null;
    }

    try {
      const response = await fetch("https://meowfacts.herokuapp.com/");
      const data = await response.json();
      
      setCardStates(prevStates => {
        const newStates = [...prevStates];
        newStates[idx].fact = data.data[0];
        newStates[idx].open = true;
        return newStates;
      });

      // Set timer to auto-close this specific card
      timersRef.current[idx] = window.setTimeout(() => {
        setCardStates(prevStates => {
          const newStates = [...prevStates];
          newStates[idx] = { ...newStates[idx], open: false, fact: "" };
          return newStates;
        });
        timersRef.current[idx] = null;
      }, AUTO_CLOSE_DELAY);

    } catch {
      setCardStates(prevStates => {
        const newStates = [...prevStates];
        newStates[idx].fact = "Failed to fetch cat fact.";
        newStates[idx].open = true;
        return newStates;
      });

      // Set timer for error case too
      timersRef.current[idx] = window.setTimeout(() => {
        setCardStates(prevStates => {
          const newStates = [...prevStates];
          newStates[idx] = { ...newStates[idx], open: false, fact: "" };
          return newStates;
        });
        timersRef.current[idx] = null;
      }, AUTO_CLOSE_DELAY);
    }
  };

  return (
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

      {/* Description text */}
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
        onClick={() => window.location.reload()}
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
        className="card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1.5rem",
          justifyContent: "center",
          margin: "2rem auto",
          maxWidth: "900px",
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
  );
}