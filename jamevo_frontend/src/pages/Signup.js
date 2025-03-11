import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    instrument: "",
    role: "user",
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

      localStorage.setItem("username", formData.username);
      localStorage.setItem("role", formData.role);

      navigate("/user")
    } catch (error) {
      setMessage(error.response?.data?.detail || "Signup failed.");
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Instrument:
          <select name="instrument" value={formData.instrument} onChange={handleChange} required>
            <option value="">Select an instrument</option>
            <option value="guitar">Guitar</option>
            <option value="bass">Bass</option>
            <option value="drums">Drums</option>
            <option value="saxophone">Saxophone</option>
            <option value="keyboard">Keyboard</option>
            <option value="vocals">Vocals</option>
          </select>
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
