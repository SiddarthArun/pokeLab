import { useState } from "react";
import PokedexContainer from "./PokedexContainer";
import Auth from "./Auth";
import Explore from "./Explore";
import LoadingPicture from "./icons/Free-HD-Pokemon-Wallpapers.jpg";
import mountains from "./icons/mountains.jpg";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [currentPage, setCurrentPage] = useState("explore");

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <div>
      {isLoggedIn ? (
        <>
          <header
            style={{
              width: "100%",
              backgroundColor: "darkRed",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className="logos">PokéLab</h1>
            <span>
              <button onClick={() => setCurrentPage("explore")}>Explore</button>
              <button onClick={() => setCurrentPage("build")}>Build</button>
              <button onClick={handleLogout}>Logout</button>
            </span>
          </header>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            {currentPage === "explore" && <Explore />}
            {currentPage === "build" && <PokedexContainer />}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            height: "100vh", // Full viewport height
            alignItems: "center", // Vertically center
            justifyContent: 'center', // Space between left & right
            padding: "0 5%", // Horizontal padding
            gap:'5%',
            backgroundImage: `url(${mountains})`,
            backgroundSize:'cover',
            backgroundPosition:"center",
            backgroundRepeat:'no-repeat'
          }}
        >
          <div style={{ width: "45%", textAlign: "center" }}>
            <h1
              style={{
                fontSize: "3.5rem",
                fontFamily: 'Reggae One',
                color: "#ff3e3e",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              PokéLab
            </h1>
            <img
              src={LoadingPicture}
              alt="Pokémon Lab"
              style={{
                maxWidth: "80%",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                borderRadius:'15px',
                boxShadow:'5px 5px 15px black'
              }}
            />
          </div>
          <div style={{ width: "45%",}}>
            <Auth
              onAuthSuccess={() => {
                setIsLoggedIn(true);
                setCurrentPage("explore");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
