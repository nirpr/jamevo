import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Results() {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    // Redirect if not an admin
    if (!username || role !== "admin") {
      navigate("/login");
      return;
    }

    // Retrieve search results
    const storedResults = sessionStorage.getItem("searchResults");
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        setSongs(parsedResults);
      } catch (error) {
        console.error("Error parsing search results:", error);
      }
    }
  }, [navigate]);

  function handleSelectSong(song) {
    console.log(`Admin selected: ${song.name} by ${song.author}`);

    sessionStorage.setItem("selectedFileName", song.file);
    sessionStorage.setItem("selectedSongName", song.name);
    sessionStorage.setItem("selectedSongAuthor", song.author);

    // Use the existing WebSocket connection to send the song update
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
      window.ws.send(`New song selected: ${song.name} by ${song.author}`);
    } else {
      console.error("WebSocket is not open.");
    }

    // Redirect to Live Page
    setTimeout(() => {
      navigate("/live");
    }, 100);
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", backgroundColor: "#111", color: "#fff"
    }}>
      <h2 style={{ fontSize: "2em", marginBottom: "20px" }}>Search Results</h2>

      {songs.length > 0 ? (
        <ul style={{
          listStyle: "none", padding: 0, margin: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"
        }}>
          {songs.map((song, index) => (
            <li key={index} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", width: "350px", padding: "10px",
              backgroundColor: "#222", borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)"
            }}>
              <span style={{ fontSize: "1.2em" }}>
                {song.name} <span style={{ fontSize: "0.9em", color: "#bbb" }}>by {song.author}</span>
              </span>
              <button onClick={() => handleSelectSong(song)} style={{
                backgroundColor: "#046997", color: "#000",
                padding: "8px 12px", fontSize: "1em", borderRadius: "5px",
                cursor: "pointer", border: "none",
                transition: "background 0.3s"
              }}>
                Select
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.2em", color: "#ff4444" }}>No results found.</p>

          {/* "Go Back" button to return to search page */}
          <button onClick={() => navigate("/admin")} style={{
            marginTop: "15px",
            backgroundColor: "#519bd2", color: "#000",
            padding: "10px 15px", fontSize: "1em", borderRadius: "5px",
            cursor: "pointer", border: "none",
            transition: "background 0.3s"
          }}>
            Go Back to Search
          </button>
        </div>
      )}
    </div>
  );
}

export default Results;
