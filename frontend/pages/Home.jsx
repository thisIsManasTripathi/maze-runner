import { useState } from "react";
import { useNavigate} from "react-router"
import "./css/Home.css";

export default function Home() {

  const [mazeConfigs, setMazeConfigs] = useState({rows:0, cols:0});
  const navigate = useNavigate();

  const handleBuild = async (e) => {
    e.preventDefault();
    navigate("/build", {state : mazeConfigs})

    console.log("Maze configs sent");
  };
  console.log(mazeConfigs)
  return (
    <div className="home">
      <form className="maze-card" onSubmit={handleBuild}>
        <h1>Maze Size</h1>

        <div className="size-inputs">
          <input
            value={mazeConfigs.rows?mazeConfigs.rows:""}
            type="number"
            min="2"
            placeholder="Rows"
            onChange={(currVal) => {setMazeConfigs(prevConfig => {return {...prevConfig, rows: Number(currVal.target.value)}})}}
          />

          <span className="cross">×</span>

          <input
            value={mazeConfigs.cols?mazeConfigs.cols:""}
            type="number"
            min="2"
            placeholder="Cols"
            onChange={(currVal) => {setMazeConfigs(prevConfig => {return {...prevConfig, cols: Number(currVal.target.value)}})}}

          />
        </div>

        <button type="submit">
          Build
        </button>
      </form>
    </div>
  );
}