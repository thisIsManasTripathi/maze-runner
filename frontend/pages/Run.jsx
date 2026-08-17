import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import RunCell from "../components/RunCell/RunCell";
import { directions, getBlockValue, getDirectionFromOffset, moveStepDuration } from "../tools";
import { gameStates } from "../tools";
import "./css/Run.css";
import Knight from "../components/Knight/Knight";
import Fallback from "../components/Fallback/Fallback";

export default function Run() {
    const location = useLocation();
    const { rewardMatrix, policy, mazeDims, goalLoc, startLoc } = location.state ?? {};
    const [currentLoc, setCurrentLoc] = useState(startLoc);
    const [directionState, setDirectionState] = useState(() => getDirectionFromOffset(currentLoc));
    const [gameState, setGameState] = useState(gameStates[0]); // IDLE in the beginning
    const [steps, setSteps] = useState(0);

    const maxStepsAllowed = (mazeDims.rows-2)*(mazeDims.cols-2);
    // console.log(directionState)

    // GAME LOOP : 
    useEffect(() => {

        //checking if won
        if (currentLoc && goalLoc &&
            currentLoc[0] === goalLoc[0] &&
            currentLoc[1] === goalLoc[1]) setGameState("VICTORY");

        //collision-detection
        if (rewardMatrix[currentLoc[0]][currentLoc[1]] === getBlockValue("wall") || steps > maxStepsAllowed) setGameState("DEAD");

        //checking if dead
        if (gameState === "DEAD" || gameState === "IDLE" || gameState == "VICTORY") return;


        const timer = setTimeout(() => {
            setCurrentLoc(([r, c]) => {
                const moveOffset = policy?.[r]?.[c] ?? [0, 0];
                // console.log(currentLoc)
                setDirectionState(getDirectionFromOffset(moveOffset));
                // console.log([r + moveOffset[0], c + moveOffset[1]])
                const nextR = r + moveOffset[0];
                const nextC = c + moveOffset[1];
                setSteps(steps+1);
                return [nextR, nextC];
            });

            if (currentLoc && goalLoc &&
                currentLoc[0] === goalLoc[0] &&
                currentLoc[1] === goalLoc[1]) setGameState("VICTORY");
        }, moveStepDuration); // adjust animation speed (ms)

        return () => clearTimeout(timer); // automatically handles cleanup on state change or unmount
    }, [gameState, currentLoc]);

    if (!rewardMatrix || !policy) {
        return (
            <Fallback />
        )
    }

    return (
        <div className="run-page">
            <h1 className="run-title">MAZE RUNNER</h1>

            <div
                className="run-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${mazeDims?.cols ?? 0}, 32px)`
                }}
            >
                {rewardMatrix.map((row, r) =>
                    row.map((cellValue, c) => {
                        const isActive = currentLoc[0] === r && currentLoc[1] === c;
                        // console.log(isActive)

                        return (
                            <RunCell
                                key={`r${r}-c${c}`}
                                value={cellValue}
                                // active={isActive}
                            />
                        );
                    })
                )}
                <Knight 
                    state={gameState}
                    direction={directionState}
                    position={currentLoc}
                />
            </div>

            <div className="run-controls">
                <button
                    onClick={() => setGameState("RUNNING")}
                    disabled={gameState === "DEAD" || gameState === "VICTORY"}
                >
                    {gameState === "VICTORY" ? "GOAL REACHED!" :
                        gameState === "DEAD" ? "WASTED" :
                            gameState == "RUNNING" ? "RUNNING..." : "START"}
                </button>

                <button
                    onClick={() => {
                        setCurrentLoc(startLoc);
                        setSteps(0)
                        setGameState("IDLE");
                    }}
                >
                    RESET
                </button>
            </div>
        </div>
    );
}