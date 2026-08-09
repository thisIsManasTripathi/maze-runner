import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import RunCell from "../components/RunCell/RunCell";
import "./css/Run.css";

export default function Run() {
    const location = useLocation();
    const { rewardMatrix, policy, mazeDims, goalLoc } = location.state ?? {};

    const [currentLoc, setCurrentLoc] = useState([1, 1]);
    const [isRunning, setIsRunning] = useState(false);

    console.log(policy)

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
                console.log(currentLoc)
                // console.log([r + moveOffset[0], c + moveOffset[1]])
                return [r + moveOffset[0], c + moveOffset[1]];
            });
        }, 800); // adjust animation speed (ms)

        return () => clearTimeout(timer); // automatically handles cleanup on state change or unmount
    }, [isRunning, currentLoc, isAtGoal, policy]);

    if (!rewardMatrix || !policy) {
        return <div className="run-page">No maze session found. Please build a maze first.</div>;
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