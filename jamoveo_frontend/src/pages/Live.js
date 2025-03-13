import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Live() {
  const [songData, setSongData] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    if (!username || (role !== "admin" && role !== "player")) {
      navigate("/login");
      return;
    }

    if (role === "admin") {
      // Admin fetches song data from the backend
      const fileName = sessionStorage.getItem("selectedFileName");

      if (!fileName) {
        console.error("No song selected.");
        navigate("/results");
        return;
      }

      axios.post(`${process.env.REACT_APP_BACKEND_URL}/choose-song/`, { filename: fileName })
        .then(response => {
          console.log("Song data received from backend:", response.data);
          setSongData(response.data.data);
          sessionStorage.setItem("selectedSongData", JSON.stringify(response.data.data)); // Store in session for players
        })
        .catch(error => {
          console.error("Error fetching song data:", error);
        });

    } else {
      //  Players load song data from sessionStorage
      const storedData = sessionStorage.getItem("selectedSongData");

      if (storedData) {
        try {
          setSongData(JSON.parse(storedData));
        } catch (error) {
          console.error("Error parsing stored song data:", error);
        }
      }
    }

  }, [navigate]);

  //  Auto-scroll effect
  useEffect(() => {
    let interval;
    if (isScrolling) {
      interval = setInterval(() => {
        const songContent = document.getElementById("songContent");
        if (songContent) {
          songContent.scrollBy({ top: 1, behavior: "smooth" });
        }
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isScrolling]);

  function handleToggleScroll() {
    setIsScrolling(prev => !prev);
  }

  function handleQuit() {
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
      window.ws.send(JSON.stringify({ type: "QUIT" }));
    }
    navigate("/admin");
  }

  function isHebrewSong(songData) {
    if (!Array.isArray(songData) || songData.length < 2) {
      return false;
    }
  
    return songData.slice(1).some(line => 
      Array.isArray(line) && line.some(word => /[\u0590-\u05FF]/.test(word.lyrics))
    );
  }

  // Reusable Button Style Function
  function buttonStyle(bgColor, textColor) {
    return {
      backgroundColor: bgColor,
      color: textColor,
      border: "none",
      borderRadius: "10px",
      padding: "10px 15px",
      fontSize: "1em",
      cursor: "pointer",
      transition: "background 0.3s",
      flex: "1",
      margin: "0 5px"
    };
  }

  return (
    <div style={{
      textAlign: "center",
      padding: "15px",
      backgroundColor: "#111",
      color: "#fff",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {/* Song Title */}
      <h1 style={{
        fontSize: "clamp(1.8em, 4vw, 2.5em)", // Responsive font-size
        fontWeight: "bold",
        color: "#519bd2",
        marginBottom: "10px",
        direction: songData ? (isHebrewSong(songData) ? "rtl" : "ltr") : "ltr",
        maxWidth: "90%", // Prevents overflow
        textAlign: "center",
      }}>
        {sessionStorage.getItem("selectedSongName")}
      </h1>
  
      {/* Author */}
      <h3 style={{
        fontSize: "clamp(1em, 3vw, 1.2em)",
        fontWeight: "normal",
        color: "#aaa",
        marginBottom: "15px",
        direction: songData ? (isHebrewSong(songData) ? "rtl" : "ltr") : "ltr"
      }}>
        by {sessionStorage.getItem("selectedSongAuthor") || "Unknown"}
      </h3>
  
      {/* Lyrics Container */}
      {songData && Array.isArray(songData) ? (
        <div id="songContent" style={{
          fontSize: "1.3em",
          whiteSpace: "pre-wrap",
          overflowY: "auto",
          height: "70vh",
          padding: "10px",
          margin: "0 auto",
          width: "95%", // Scales properly for mobile
          maxWidth: "600px", // Avoids overly wide display on desktop
          border: "2px solid #444",
          backgroundColor: "#222",
          color: "#eee",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
          direction: songData ? (isHebrewSong(songData) ? "rtl" : "ltr") : "ltr"
        }}>
          {songData.slice(1).map((line, index) => (
            Array.isArray(line) ? (
              <div key={index} style={{ 
                display: "flex", flexWrap: "wrap", justifyContent: "center", 
                gap: "10px", marginBottom: "8px" 
              }}>
                {line.map((word, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "40px" }}>
                    <span style={{
                      fontSize: "1em",
                      fontWeight: "bold",
                      color: word.chords ? "#b2d8d8" : "transparent",
                      height: "1.2em",
                      display: "block",
                      visibility: sessionStorage.getItem("instrument") === "vocals" ? "hidden" : "visible"
                    }}>
                      {word.chords || " "}
                    </span>
                    <span style={{ fontSize: "1.3em", color: "#fff" }}>{word.lyrics}</span>
                  </div>
                ))}
              </div>
            ) : null
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "1.2em", color: "#519bd2" }}>Loading song...</p>
      )}
  
      {/* Buttons */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: "400px",
        marginTop: "15px"
      }}>
        {/* Quit Button (Admin Only) */}
        {sessionStorage.getItem("role") === "admin" && (
          <button onClick={handleQuit} style={buttonStyle("#d9534f", "#fff")}>
            Quit
          </button>
        )}
  
        {/* Auto-Scroll Button */}
        <button onClick={handleToggleScroll} style={buttonStyle(isScrolling ? "#d9534f" : "#06a937", "#000")}>
          {isScrolling ? "Stop Scrolling" : "Start Scrolling"}
        </button>
      </div>
    </div>
  );

}
  

export default Live;
