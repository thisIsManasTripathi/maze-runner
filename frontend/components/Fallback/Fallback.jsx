import { useNavigate } from "react-router";
import "./Fallback.css";

export default function Fallback() {
    const navigate = useNavigate();

    function handleBuild() {
        navigate("/");
    }

    return (
        <div className="no-maze-page">
            <h1>NO MAZE TO RUN</h1>

            <p>Build a maze before starting a simulation.</p>

            <button onClick={handleBuild}>
                BUILD A MAZE
            </button>
        </div>
    );
}