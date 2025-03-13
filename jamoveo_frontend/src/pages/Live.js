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

  return (
    <div style={{
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#111",
      color: "#fff",
      height: "96vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }}>
    <h1 style={{
      fontSize: "2.5em",
      fontWeight: "bold",
      color: "#519bd2",
      marginBottom: "20px",
      direction: songData ? (isHebrewSong(songData) ? "rtl" : "ltr") : "ltr"
    }}>
      {sessionStorage.getItem("selectedSongName")}
    </h1>

    <h3 style={{
      fontSize: "1.2em",
      fontWeight: "normal",
      color: "#aaa",
      marginBottom: "20px",
      direction: songData ? (isHebrewSong(songData) ? "rtl" : "ltr") : "ltr"
    }}>
      by {sessionStorage.getItem("selectedSongAuthor") || "Unknown"}
    </h3>

    {songData && Array.isArray(songData) ? (
      <div id="songContent" style={{
        fontSize: "1.5em",
        whiteSpace: "pre-wrap",
        overflowY: "auto",
        height: "75vh",
        padding: "15px",
        margin: "0 auto",
        maxWidth: "650px",
        border: "2px solid #444",
        backgroundColor: "#222",
        color: "#eee",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
        direction: songData ? (isHebrewSong(songData) ? "rtl" : "ltr") : "ltr"
      }}>
      {songData.slice(1).map((line, index) => ( // Skip the first element (metadata)
        Array.isArray(line) ? (
          <div key={index} style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "10px" }}>
            {line.map((word, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "50px" }}>
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
  
      {/* Buttons Container */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "10px 20px",
        marginTop: "auto"  
      }}>
        {/* Quit button for admin */}
        {sessionStorage.getItem("role") === "admin" && (
          <button
            onClick={handleQuit}
            style={{
              backgroundColor: "#d9534f",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              padding: "10px 20px",
              fontSize: "1em",
              cursor: "pointer",
              transition: "background 0.3s"
            }}
          >
            Quit
          </button>
        )}
  
        {/* Auto-scroll button */}
        <button
          onClick={handleToggleScroll}
          style={{
            backgroundColor: isScrolling ? "#d9534f" : "#06a937",
            color: "#000",
            border: "none",
            borderRadius: "50px",
            padding: "10px 20px",
            fontSize: "1em",
            cursor: "pointer",
            transition: "background 0.3s"
          }}
        >
          {isScrolling ? "Stop Scrolling" : "Start Scrolling"}
        </button>
      </div>
    </div>
  );
   
}

export default Live;
