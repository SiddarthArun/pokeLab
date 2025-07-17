import { useState } from "react";
import Modal from "./modal";

function Auth({ onAuthSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null)

  const divStyle = {
    backgroundColor:'lightGrey',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    width:'30%',
    boxShadow:'5px 5px 15px black'
  }
  const inputStyle = {
    marginBottom:'10px',
  }

  async function handleAuth(endpoint) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error", data.error);
        //alert(data.error);
        setErrorMessage(data.error)
        return;
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        //alert("Logged in successfully");
        onAuthSuccess();
      } else {
        //alert("Registered successfully! Now log in.");
        setErrorMessage('Registered Successfully! Now log in.')
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div style={divStyle}>
      <h2>Login or Register</h2>
      <input
        style={inputStyle}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br></br>

      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => handleAuth("login")}>Login</button>
        <button onClick={() => handleAuth("register")}>Register</button>
      </div>

      {errorMessage && (
        <Modal onClose={()=>setErrorMessage(null)}>
          <p>{errorMessage}</p>
        </Modal>
      )}
    </div>
  );
}

export default Auth;
