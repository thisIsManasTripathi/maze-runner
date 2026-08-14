import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import RunCell from "../components/RunCell/RunCell";
import { directions, getDirectionFromOffset, moveStepDuration } from "../tools";
import { gameStates } from "../tools";
import "./css/Run.css";
import Fallback from "../components/Fallback/Fallback";

export default function Run() {
    const location = useLocation();
    const { rewardMatrix, policy, mazeDims, goalLoc, startLoc } = location.state ?? {};
    const [directionState, setDirectionState] = useState(null);
    const [gameState, setGameState] = useState();
    const [currentLoc, setCurrentLoc] = useState(startLoc);
    const [isRunning, setIsRunning] = useState(false);

    // console.log(directionState)

    // Check if goal is reached
    const isAtGoal = currentLoc && goalLoc && 
        currentLoc[0] === goalLoc[0] && 
        currentLoc[1] === goalLoc[1];

    // Driven by useEffect: automatically advances state when isRunning is true
    useEffect(() => {
        if (!isRunning || isAtGoal) return;

        const timer = setTimeout(() => {
            setCurrentLoc(([r, c]) => {
                const moveOffset = policy?.[r]?.[c] ?? [0, 0];
                // console.log(currentLoc)
                setDirectionState(getDirectionFromOffset(moveOffset));
                // console.log([r + moveOffset[0], c + moveOffset[1]])

                return [r + moveOffset[0], c + moveOffset[1]];
            });
        }, moveStepDuration); // adjust animation speed (ms)

        return () => clearTimeout(timer); // automatically handles cleanup on state change or unmount
    }, [isRunning, currentLoc, isAtGoal, policy]);

    if (!rewardMatrix || !policy) {
        return (
            <Fallback />
        )
    }

    return (
        <div className="run-page">
            <h1 className="run-title">MAZE RUNNER</h1>

            {/* Render 2D Grid with nested map (No .flat() or math division needed!) */}
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
                                active={isActive}
                            />
                        );
                    })
                )}
            </div>

            <div className="run-controls">
                <button 
                    onClick={() => setIsRunning(true)} 
                    disabled={isRunning || isAtGoal}
                >
                    {isAtGoal ? "GOAL REACHED!" : isRunning ? "RUNNING..." : "START"}
                </button>

                <button 
                    onClick={() => {
                        setIsRunning(false);
                        setCurrentLoc([1, 1]);
                    }}
                >
                    RESET
                </button>
            </div>
        </div>
    );
}