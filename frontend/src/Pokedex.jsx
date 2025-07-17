import React, { useState } from "react";
import searchIcon from './icons/search_icon_google.svg'
import Modal from "./modal";

function Pokedex(props) {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonData, setPokemonData] = useState();
  const [Error, setError] = useState();

  const [SelectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null)

  const divstyles = {
    backgroundColor: "darkGrey",
    color: "black",
    borderRadius: "20px",
    textAlign: "center",
    padding: "20px",
    margin: "20px",
    width:'35vw',
    border:'2px solid grey',
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
      setErrorMessage('There was an issue retrieving that Pokemons Info'  )
      //alert("There was an issue retrieving that Pokemons info");
      setSelectedPokemon(pokemon)
    }
  }

  async function searchPokemon(event) {
    event.preventDefault();
    console.log(`Searching for: ${pokemonName}`);
    setError(null);

    if (pokemonName.trim().length === 0) {
    setError('Please enter a Pokémon name');
    return;
  }
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      if (!response.ok) {
        throw new Error("Pokemon not Found");
      }
      const data = await response.json();
      console.log(data);
      setPokemonData(data);
      props.onNameChange(props.index, data.name, data.sprites.front_default)
    } catch (error) {
      console.error(error);
      setError(`That's not a pokemon`);
      setErrorMessage(`That's not a pokemon`)
    }
  }

  let pokemonInfo = {};
  if (pokemonData) {
    pokemonInfo["Name"] = pokemonData.name;
    pokemonInfo["Type"] = pokemonData.types.map((t) => t.type.name).join(", ");
    pokemonInfo["Sprite"] = pokemonData.sprites.front_default;
  }

  return (
    <>
      <div style={divstyles}>
        <h1>{pokemonInfo.Name}</h1>
        
        <h3>{pokemonInfo.Type}</h3>
        <h3>{pokemonName?'':'Search a Pokémon!'}</h3>
        <img className="picLabel" src={pokemonInfo.Sprite} onClick={()=> handlePokemonClick({name:pokemonInfo.Name, sprite:pokemonInfo.Sprite})} />

        <form onSubmit={searchPokemon}>
          <input
            placeholder="Enter a Pokémon"
            type="text"
            value={pokemonName}
            onChange={(e) => {
              setPokemonName(e.target.value); // updates local state
            }}
          />

          <button disabled={pokemonName.trim().length === 0}><img src={searchIcon}/></button>
        </form>
      </div>

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

      {errorMessage && (
        <Modal onClose={()=>setErrorMessage(null)}>
          <p>{errorMessage}</p>
        </Modal>
      )}

    </>
  );
}

export default Pokedex;
