import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Admin() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    // Redirect if not an admin
    if (!username || role !== "admin") {
      navigate("/login");
      return;
    }

    if (!window.ws || window.ws.readyState === WebSocket.CLOSED) {
      window.ws = new WebSocket(`ws://localhost:8000/ws?username=${username}`);

      window.ws.onopen = () => {
        console.log("Admin connected to WebSocket");
      };

      window.ws.onclose = () => {
        console.log("Disconnected from WebSocket");
      };
    }

  }, [navigate]);

  async function handleSearch(e) {
    e.preventDefault();
    
    if (!searchQuery.trim()) return; // Prevent empty searches

    try {
      const response = await axios.get(`http://localhost:8000/search/?query=${searchQuery}&username=${sessionStorage.getItem("username")}`);
      
      // Save search results before navigating
      sessionStorage.setItem("searchResults", JSON.stringify(response.data.results));

      // Redirect to results page
      navigate("/results");

    } catch (error) {
      console.error("Search failed:", error.response?.data?.detail || error.message);
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", backgroundColor: "#111", color: "#fff"
    }}>
      <h2 style={{ fontSize: "2em", marginBottom: "20px" }}>Search a song</h2>

      <form onSubmit={handleSearch} style={{
        display: "flex", flexDirection: "column", gap: "15px",
        backgroundColor: "#222", padding: "25px", borderRadius: "10px",
        width: "350px", textAlign: "center", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
      }}>
        <input type="text" placeholder="Enter song name"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} required
          style={{
            width: "93%", padding: "12px",
            borderRadius: "5px", border: "1px solid #555", fontSize: "1.1em",
            backgroundColor: "#333", color: "#fff"
          }}
        />

        <button type="submit" style={{
          backgroundColor: "#046997", color: "#fff",
          padding: "12px", fontSize: "1.2em", borderRadius: "5px",
          cursor: "pointer", border: "none", width: "100%",
          transition: "background 0.3s"
        }}>
          Search
        </button>
      </form>
    </div>
  );
}

export default Admin;
