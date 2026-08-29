import { useNavigate } from "react-router";
import "./Fallback.css";

export default function Fallback() {
    const navigate = useNavigate();

    function handleBuild() {
        navigate("/");
    }

    return (
        <div className="no-maze-page">
            <div>

            </div>
            <h1>NO MAZES TO RUN :/</h1>
            <div id="dead-knight"></div>

            <p>Build a maze before starting a simulation.</p>

            <button onClick={handleBuild}>
                BUILD A MAZE
            </button>
        </div>
    );
}