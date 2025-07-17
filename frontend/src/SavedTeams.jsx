import deleteIcon from "./icons/delete_icon_google.svg";
import { useState } from "react";
import Modal from "./modal";

function SavedTeams(props) {
  const [SelectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPokemonStats, setSelectedPokemonStats] = useState(null);

  const divstyle = {
    border: "2px solid gray",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "10px",
    backgroundColor: "darkGrey",
    textAlign: "center",
  };

  const cardLayout = {
    display: "flex",
    gap: "10px",
  };

  async function handlePokemonClick(pokemon) {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`
      );
      const data = await response.json();

      const stats = {
        hp: data.stats[0]["base_stat"],
        attack: data.stats[1]["base_stat"],
        defense: data.stats[2]["base_stat"],
        "special-attack": data.stats[3]["base_stat"],
        "special-defense": data.stats[4]["base_stat"],
        speed: data.stats[5]["base_stat"],
      };

      const types = data.types.map(t=>t.type.name+' ')

      setSelectedPokemon({ ...pokemon, stats, types });
    } catch {
      alert("There was an issue retrieving that Pokemons info");
      setSelectedPokemon(pokemon)
    }
  }

  return (
    <>
      
      {props.savedTeams.map((team) => (
        <div key={team.id} style={divstyle}>
          <h3>Team Name: {team.name}</h3>
          <div style={cardLayout}>
            {team.pokemons.map((poke, index) => (
              <div className="picLabel" key={index} style={{ textAlign: "center" }}>
                <img
                  src={poke.sprite}
                  onClick={() => {
                    handlePokemonClick(poke);
                  }}
                  alt={poke.name}
                  style={{ width: "80px" }}
                />
                <p>{poke.name}</p>
              </div>
            ))}
          </div>
          {props.showDelete &&(
            <button style={{marginTop:'15px'}} onClick={() => props.onDelete(team.id)}>
            <img src={deleteIcon} />
          </button>
          )}
          
        </div>
      ))}

      {isModalOpen && SelectedPokemon && (
        <Modal
          onClose={() => {
            setIsModalOpen(false);
          }}
        >
          <div style={{textAlign:"center", padding:'10px'}}>
          <h2>{SelectedPokemon.name}</h2>
          <h4>{SelectedPokemon.types}</h4>
          <img className="modalPic" src={SelectedPokemon.sprite} />
          </div>
          

          {SelectedPokemon.stats ? (
            <div style={{padding:'15px', paddingLeft:'15px', }}>
              <h3 style={{textAlign:'center'}}>Stats</h3>
              <ul>
                {Object.entries(SelectedPokemon.stats).map(
                  ([statName, value]) => (
                    <li key={statName}>
                      <strong>{statName}:</strong> {value}
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : (
            <p>Loading Stats...</p>
          )}
        </Modal>
      )}
    </>
  );
}

export default SavedTeams;
