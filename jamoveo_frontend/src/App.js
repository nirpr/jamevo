import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import AdminSignup from "./pages/AdminSignup";
import Login from "./pages/Login";
import Player from "./pages/Player";
import Admin from "./pages/Admin";
import Results from "./pages/Results";
import Live from "./pages/Live";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            height: "100vh", backgroundColor: "#111", color: "#fff", padding: "20px"
          }}>
            <h1 style={{
              fontSize: "2em", textAlign: "center", marginBottom: "20px",
              maxWidth: "90%", lineHeight: "1.2"
            }}>
              Welcome to JaMoveo
            </h1>

            <div style={{
              display: "flex", flexDirection: "column", gap: "12px",
              width: "100%", maxWidth: "300px", textAlign: "center"
            }}>
              <Link to="/signup">
                <button style={buttonStyle}>Signup</button>
              </Link>
              <Link to="/admin-signup">
                <button style={buttonStyle}>Admin Signup</button>
              </Link>
              <Link to="/login">
                <button style={buttonStyle}>Login</button>
              </Link>
            </div>
          </div>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player" element={<Player />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/results" element={<Results />} />
        <Route path="/live" element={<Live />} />


      </Routes>
    </Router>
  );
}

const buttonStyle = {
  backgroundColor: "#046997",
  color: "#000",
  border: "none",
  borderRadius: "10px",
  padding: "12px 20px",
  fontSize: "1.2em",
  cursor: "pointer",
  textAlign: "center",
  width: "200px",
  transition: "background 0.3s",
};

export default App;
