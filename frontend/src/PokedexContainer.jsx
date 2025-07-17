import { useState, useEffect } from "react";
import Pokedex from "./Pokedex";
import SavedTeams from "./SavedTeams";
import Modal from "./modal";
import { apiFetch } from "./ApiFetch";
import reloadIcon from "./icons/reload_icon_google.svg";


function PokedexContainer() {
  const [pokedexList, setPokedexList] = useState([0]);
  const [team, setTeam] = useState([{ name: "", sprite: "" }]);
  const [teamName, setTeamName] = useState("");
  const [savedTeams, setSavedTeams] = useState([]);
  const [analysis, setAnalysis] = useState({defensive_weaknesses: [], offensive_weaknesses: [], stat_weak_pokemon: [] });
  const [currentPage,setCurrentPage] = useState(1)
  const [totalPages,setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const buttonStyles = {
    marginLeft: "20px",
    marginBottom: "5px",
  };

  function addPokedex() {
    if (pokedexList.length < 6) {
      setPokedexList([...pokedexList, pokedexList.length]);
      setTeam([...team, { name: "", sprite: "" }]);
    }
  }
  function resetPokedex() {
    setPokedexList([0]);
    setTeam([{ name: "", sprite: "" }]);
    setTeamName("");
  }

  function updateTeam(index, newName, newSprite) {
    setTeam((currentTeam) =>
      currentTeam.map((pokemon, i) => {
        if (i === index) {
          return { name: newName, sprite: newSprite };
        }
        return pokemon;
      })
    );
  }

  async function saveTeam() {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        //alert("You must be logged in to save a team!");
        setErrorMessage('You must be logged in to save a team')
        return;
      }

      if (!teamName) {
        //alert("Name your team before saving!");
        setErrorMessage('Name your team before saving')
        return;
      }
      const nonEmptyTeam = team.filter(pokemon => pokemon.name.trim() !== '')
      if (nonEmptyTeam.length === 0) {
      //alert("Please add at least one Pokémon before saving.");
      setErrorMessage('Add at least one Pokémon before saving')
      return;
    }

      console.log("Saving this team:", team);
      const response = await apiFetch("http://127.0.0.1:5000/save_team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: teamName,
          pokemons: team,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error", errorData);
        return;
      }

      const data = await response.json();
      console.log("Saved: ", data.message);
      loadTeams(currentPage)
      setErrorMessage("Team saved successfully!")
      setTimeout(() => setErrorMessage(null), 1000)
    } catch (err) {
      console.error("Error saving team: ", err);
    }
  }

  async function loadTeams(page=1) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        //alert("You must be logged in to load a team");
        setErrorMessage('You must be logged in to load a team')
        return;
      }

      const response = await apiFetch(`http://127.0.0.1:5000/my_teams?page=${page}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      const data = await response.json();
      console.log("Loaded teams: ", data.teams);

      setSavedTeams(data.teams);
      setCurrentPage(data.page)
      setTotalPages(data.total_pages)
      setHasNext(data.has_next)
      setHasPrev(data.has_prev)
    } catch (err) {
      console.error("Error loading teams: ", err);
    }
  }

  function handleChange(e) {
    setTeamName(e.target.value);
  }

  async function handleDelete(teamID) {
    const token = localStorage.getItem("token");

    if (!token) {
      //alert("Login required to delete");
      setErrorMessage('Login required to delete')
      return;
    }

    try {
      const response = await apiFetch("http://127.0.0.1:5000/delete_team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: teamID }),
      });

      const result = await response.json();
      console.log(result.message || result.error);

      if (response.ok) {
        setSavedTeams(savedTeams.filter((team) => team.id !== teamID));
      }
    } catch (err) {
      console.error("Error deleting team", err);
    }
  }

  async function handleAnalyze() {
    const nonEmptyTeam = team.filter((pokemon) => pokemon.name.trim() !== "");

    if (nonEmptyTeam.length === 0) {
      //alert("Please add at least one Pokémon before analyzing.");
      setErrorMessage('Please add at least one Pokémon before analyzing')
      return;
    }
    try {
      const response = await apiFetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team: team }),
      });
      const data = await response.json();
      console.log("Analysis results", data);

      setAnalysis(data)

      setIsModalOpen(true)
    } catch (err) {
      console.error("Error analyzing team", err);
    }
  }

  useEffect(()=>{
    loadTeams()
  }, [])


  return (
    <div id="main-container" style={{ display: 'flex', justifyContent: 'space-around', flexWrap:'wrap' }}>
      <div id="pokedexes">
      <input
      style={{boxShadow: '2px 2px 112px black'}}
        placeholder="team name"
        type="text"
        value={teamName}
        onChange={handleChange}
      />
      <button style={buttonStyles} onClick={addPokedex}>
        Add a Pokemon
      </button>
      <button style={buttonStyles} onClick={resetPokedex}>
        Reset
      </button>

      
      {pokedexList.map((id, index) => (

        <Pokedex key={id} index={index} onNameChange={updateTeam} />

      ))}

      <button onClick={handleAnalyze}>Analyze Team</button>
      <button onClick={saveTeam}>Save Team</button>
      
      </div>

      <div id="teams" style={{textAlign:'center'}}>
      <h1>My Teams <button onClick={loadTeams}><img src={reloadIcon}/></button> </h1>
      <h2>{savedTeams.length===0?'You have no teams. Make one':''}</h2>
      <SavedTeams savedTeams={savedTeams} onDelete={handleDelete} showDelete={true} />
      <button disabled={!hasPrev} onClick={()=>loadTeams(currentPage-1)}>Previous</button>
      <span style={{color:'white'}}>Page {currentPage} of {totalPages}</span>
      <button disabled={!hasNext} onClick={()=>loadTeams(currentPage+1)}>Next</button>
      </div>

      {isModalOpen && (
        <Modal onClose={()=>setIsModalOpen(false)}>
          <div style={{padding:'10px'}}>
            <h3>Defensive Weaknesses</h3>
          <ul>
            {analysis.defensive_weaknesses.length > 0 ? (
              analysis.defensive_weaknesses.map((item,index)=>(
                <li key={index}>{item.score > 5 ? <b>{item.type}</b> : item.type}</li>
              ))
            ):(<li><b>No Defensive Weaknesses</b></li>)}
          </ul>
          </div>
          
          
          <div style={{padding:'10px'}}>
            <h3>Offensive Weaknesses</h3>
          <ul>
            {analysis.offensive_weaknesses.length > 0 ? (
              analysis.offensive_weaknesses.map((item,index)=>(
                <li key={index}>
                  {item.score <= 3 ? <b>{item.type}</b> : item.type}
                </li>
              ))
            ):(<li><b>No Offensive Weaknesses</b></li>)}
          </ul>
          </div>
          
          
          <div style={{padding:'10px'}}>
            <h3>Weak Pokemon</h3>
          <ul>
            {analysis.stat_weak_pokemon.length > 0 ? (
              analysis.stat_weak_pokemon.map((pokemon,index)=>(
                <li key={index}>{pokemon}</li>
              ))
            ):(<li><b>All Strong Pokemon</b></li>)}
          </ul>
          </div>
          

        </Modal>
      )}

      {errorMessage && (
        <Modal onClose={()=>setErrorMessage(null)}>
          <p>{errorMessage}</p>
        </Modal>
      )}

    </div>
  );
}

export default PokedexContainer;
