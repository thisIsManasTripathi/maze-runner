import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import RunCell from "../components/RunCell/RunCell";
import {
    directions,
    getBlockValue,
    getDirectionFromOffset,
    moveStepDuration
} from "../tools";
import { gameStates } from "../tools";
import "./css/Run.css";
import Knight from "../components/Knight/Knight";
import Fallback from "../components/Fallback/Fallback";

export default function Run() {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        rewardMatrix,
        policy,
        mazeDims,
        goalLoc,
        startLoc
    } = location.state ?? {};

    // console.log(location.state)

    if (!location.state) return ( <Fallback />)

    const [currentLoc, setCurrentLoc] = useState(startLoc??null);

    const [directionState, setDirectionState] = useState(
        () => getDirectionFromOffset(currentLoc)
    );

    const [gameState, setGameState] = useState(gameStates[0]);
    const [steps, setSteps] = useState(0);

    const maxStepsAllowed =
        (mazeDims.rows - 2) * (mazeDims.cols - 2);


    // GAME LOOP :
    useEffect(() => {

        // checking if won
        if (
            currentLoc &&
            goalLoc &&
            currentLoc[0] === goalLoc[0] &&
            currentLoc[1] === goalLoc[1]
        ) {
            setGameState("VICTORY");
        }

        // collision-detection
        if (
            rewardMatrix[currentLoc[0]][currentLoc[1]] ===
            getBlockValue("wall") ||
            steps > maxStepsAllowed
        ) {
            setGameState("DEAD");
        }

        // checking if dead
        if (
            gameState === "DEAD" ||
            gameState === "IDLE" ||
            gameState == "VICTORY"
        ) return;


        const timer = setTimeout(() => {

            setCurrentLoc(([r, c]) => {

                const moveOffset =
                    policy?.[r]?.[c] ?? [0, 0];

                setDirectionState(
                    getDirectionFromOffset(moveOffset)
                );

                const nextR = r + moveOffset[0];
                const nextC = c + moveOffset[1];

                setSteps(steps + 1);

                return [nextR, nextC];
            });


            if (
                currentLoc &&
                goalLoc &&
                currentLoc[0] === goalLoc[0] &&
                currentLoc[1] === goalLoc[1]
            ) {
                setGameState("VICTORY");
            }

        }, moveStepDuration);

        return () => clearTimeout(timer);

    }, [gameState, currentLoc]);


    // if (!rewardMatrix || !policy) {
    //     return <Fallback />;
    // }


    return (
        <div className="run-page">


            <h1 className="run-title">
                MAZE RUNNER
            </h1>


            <div className="run-game-area">


                <div className="run-maze-container">

                    <div
                        className="run-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                `repeat(${mazeDims?.cols ?? 0}, 32px)`
                        }}
                    >

                        {rewardMatrix.map((row, r) =>
                            row.map((cellValue, c) => {

                                return (
                                    <RunCell
                                        key={`r${r}-c${c}`}
                                        value={cellValue}
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

                </div>


                <div className="run-controls">

                    <button
                        className="run-control-button"
                        onClick={() =>
                            setGameState("RUNNING")
                        }
                        disabled={
                            gameState === "DEAD" ||
                            gameState === "VICTORY" ||
                            gameState === "RUNNING"
                        }
                    >

                        {gameState === "VICTORY" ? (
                            <img
                                src="/assets/victory.png"
                                alt=""
                            />
                        ) : gameState === "DEAD" ? (
                            <img
                                src="/assets/dead.png"
                                alt="Dead"
                            />
                        ) : gameState === "RUNNING" ? (
                            <img
                                src="/assets/resume.png"
                                alt="Running"
                            />
                        ) : (
                            <img
                                src="/assets/play.png"
                                alt="Start"
                            />
                        )}

                    </button>


                    <button
                        className="run-control-button"
                        onClick={() => {
                            setCurrentLoc(startLoc);
                            setSteps(0);
                            setGameState("IDLE");
                        }}
                    >

                        <img
                            src="../../assets/restart.png"
                            alt="Restart"
                        />

                    </button>
                    <button
                        className="run-control-button"
                        onClick={() => { navigate("/") }}
                    >

                        <img
                            src="../../assets/home.png"
                            alt="Home"
                        />

                    </button>
                    <button
                        className="run-control-button"
                        onClick={() => { navigate("/build", { state: { ...location.state } }) }}
                    >

                        <img
                            src="/assets/edit-maze.png"
                            alt="Edit maze"
                        />

                    </button>

                </div>

            </div>

        </div>
    );
}