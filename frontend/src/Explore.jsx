import SavedTeams from "./SavedTeams";
import { useState, useEffect } from "react";
import { apiFetch } from "./ApiFetch";

function Explore() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [savedTeams, setSavedTeams] = useState([]);


  async function loadTeams(page = 1) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to load a team");
        return;
      }

      const response = await apiFetch(
        `http://127.0.0.1:5000/teams?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log("Loaded teams: ", data.teams);


      setSavedTeams(data.teams);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
      setHasNext(data.has_next);
      setHasPrev(data.has_prev);

      


    } catch (err) {
      console.error("Error loading teams: ", err);
    }
  }
  
  useEffect(() => {
        loadTeams();
      }, []);

  return (
    <div>
      <div id="teams" style={{ display: "flex", justifyContent: "space-around", flexWrap:'wrap'}}>
        <div style={{padding:'10px'}}><SavedTeams savedTeams={savedTeams.slice(0, Math.ceil(savedTeams.length/2))} showDelete={false} onDelete={() => {}} /></div>
        
        <div style={{padding:'10px'}}><SavedTeams savedTeams={savedTeams.slice(Math.ceil(savedTeams.length/2))} showDelete={false} onDelete={() => {}} /></div>
        </div>

        <div style={{textAlign:'center'}}>
        <button disabled={!hasPrev} onClick={() => loadTeams(currentPage - 1)}>
          Previous
        </button>
        <span style={{ color: "white", marginBottom:'10px'}}>
          Page {currentPage} of {totalPages}
        </span>
        <button disabled={!hasNext} onClick={() => loadTeams(currentPage + 1)}>
          Next
        </button>
        </div>
    </div>
  );
}

export default Explore;
