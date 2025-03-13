import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Player() {
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    // Redirect if not a player
    if (!username || role !== "player") {
      navigate("/login");
      return;
    }

    if (!window.ws || window.ws.readyState === WebSocket.CLOSED) {
      window.ws = new WebSocket(`ws://localhost:8000/ws?username=${username}`);

      window.ws.onopen = () => {
        console.log("Connected to WebSocket");
      };

      window.ws.onmessage = (event) => {
        console.log("Received message:", event.data);
        
        try {
          const message = JSON.parse(event.data);
      
          if (message.type === "song_selected") {
            sessionStorage.setItem("selectedSongName", message.song_name);
            sessionStorage.setItem("selectedSongData", JSON.stringify(message.data));
      
            navigate("/live");
          }
      
          if (message.type === "QUIT") {
            console.log("Admin quit the session. Redirecting to player page.");
            navigate("/player"); //  Player goes back to waiting page
          }
      
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      };

      window.ws.onclose = () => {
        console.log("Disconnected from WebSocket");
      };
    }
  }, [navigate]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", backgroundColor: "#111", color: "#fff"
    }}>
      <h2 style={{ fontSize: "2em", marginBottom: "20px" }}>Waiting for admin to pick a song</h2>
  
      {/* Rotating Loading Widget */}
      <div style={{
        width: "50px", height: "50px",
        border: "6px solid rgba(255, 255, 255, 0.3)",
        borderTop: "6px solid #046997",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }}></div>
  
      {/* Keyframe Animation for Spinning */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
  
}

export default Player;
