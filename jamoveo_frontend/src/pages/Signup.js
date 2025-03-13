import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    instrument: "",
    role: "player",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://localhost:8000/signup/", formData);

      sessionStorage.setItem("username", formData.username);
      sessionStorage.setItem("role", formData.role);
      sessionStorage.setItem("instrument", formData.instrument);

      navigate(`/${formData.role}`);
    } catch (error) {
      setMessage(error.response?.data?.detail || "Signup failed.");
    }
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", backgroundColor: "#111", color: "#fff"
    }}>
      <h2 style={{ fontSize: "2em", marginBottom: "20px" }}>Signup</h2>

      <form onSubmit={handleSubmit} style={{
        display: "flex", flexDirection: "column", gap: "15px",
        backgroundColor: "#222", padding: "25px", borderRadius: "10px",
        width: "320px", textAlign: "center", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)"
      }}>
        {/* Username */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "93%" }}>
          <label style={{ fontSize: "1.1em", marginBottom: "5px" }}>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required
            style={{
              width: "100%", padding: "10px",
              borderRadius: "5px", border: "1px solid #555", fontSize: "1em",
              backgroundColor: "#333", color: "#fff"
            }}
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "93%" }}>
          <label style={{ fontSize: "1.1em", marginBottom: "5px" }}>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required
            style={{
              width: "100%", padding: "10px",
              borderRadius: "5px", border: "1px solid #555", fontSize: "1em",
              backgroundColor: "#333", color: "#fff"
            }}
          />
        </div>

        {/* Instrument Selection */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          <label style={{ fontSize: "1.1em", marginBottom: "5px" }}>Instrument:</label>
          <select name="instrument" value={formData.instrument} onChange={handleChange} required
            style={{
              width: "100%", padding: "10px",
              borderRadius: "5px", border: "1px solid #555", fontSize: "1em",
              backgroundColor: "#333", color: "#fff"
            }}
          >
            <option value="">Select an instrument</option>
            <option value="guitar">Guitar</option>
            <option value="bass">Bass</option>
            <option value="drums">Drums</option>
            <option value="saxophone">Saxophone</option>
            <option value="keyboard">Keyboard</option>
            <option value="vocals">Vocals</option>
          </select>
        </div>

        {/* Signup Button */}
        <button type="submit" style={{
          backgroundColor: "#046997", color: "#000",
          padding: "12px", fontSize: "1.2em", borderRadius: "5px",
          cursor: "pointer", border: "none", width: "100%",
          transition: "background 0.3s"
        }}>
          Sign Up
        </button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "#ff4444" }}>{message}</p>}
    </div>
  );
}

export default Signup;
