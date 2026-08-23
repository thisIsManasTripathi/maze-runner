import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { FaBan } from "react-icons/fa";

import Cell from "../components/Cell/Cell";
import ToolBarCell from "../components/ToolBarCell/ToolBarCell";
import { tools, getBlockValue } from "../tools";
import Fallback from "../components/Fallback/Fallback";

import "./css/Build.css";

export default function Build() {

    const [mazeDims, setMazeDims] = useState(null);
    const [mazeGrid, setMazeGrid] = useState(null);
    const [toolArray, setToolArray] = useState(() => {
        return tools.map((item) => {
            if (item.name === "wall") return { ...item, active: true }
            else return { ...item, active: false }
        })
    });
    const [goalLocation, setGoalLocation] = useState(null);
    const [startLocation, setStartLocation] = useState(() => [1, 1]);
    const [policy, setPolicy] = useState(null);
    const location = useLocation();

    /*
     * UI state only
     */
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [cursor, setCursor] = useState({
        x: 0,
        y: 0,
        visible: false,
        blocked: false
    });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState(null);

    const [loadingState, setLoadingState] = useState(0);


    const [selectedModel, setSelectedModel] = useState("SARSA");
    const [showParams, setShowParams] = useState(false);

    const [modelParams, setModelParams] = useState({
        numEpisodes: 1000,
        numRounds: 10,
        epsilon: 0.1,
        gamma: 0.9
    });

    const draftParamsRef = useRef({
        numEpisodes: 1000,
        numRounds: 100,
        epsilon: 0.1,
        gamma: 0.9
    });

    function buildEmptyWorld(rows, cols) {
        return Array.from({ length: rows }, (_, r) => {
            return Array.from({ length: cols }, (_, c) => {
                if ((r === 0 || r === rows - 1) || (c === 0 || c === cols - 1))
                    return getBlockValue("wall");
                else
                    return getBlockValue("eraser");
            });
        })
    }

    async function runMaze() {
        navigate('/run', {
            state: {
                mazeDims: mazeDims,
                rewardMatrix: mazeGrid,
                policy: policy,
                startLoc: startLocation,
                goalLoc: goalLocation
            }
        })
    }

    useEffect(() => {

        if (!(location?.state ?? null)) return;

        const { rows, cols } = location.state ?? {};

        setMazeGrid((prev) => {
            const grid = buildEmptyWorld(rows + 2, cols + 2);
            return grid;
        });

        setMazeDims({
            rows: rows + 2,
            cols: cols + 2
        });

    }, []);

    useEffect(() => {
        if (!policy) return;

        runMaze();

    }, [policy])

    function currentSelectedTool() {
        for (const tool of toolArray) {
            if (tool.active === true) return tool;
        }
        return null;
    }


    function fillCell(loc, value) {
        //If the curr cell ain't path AND curr tool ain't eraser (cause eraser can reset cell values) then invalid oprn
        if ((mazeGrid[loc[0]][loc[1]] !== getBlockValue("eraser") || (startLocation[0] === loc[0] && startLocation[1] === loc[1])) && currentSelectedTool().name !== "eraser") return;


        if (currentSelectedTool().name === "goal") {

            setMazeGrid(prevMazeGrid => {
                let newMazeGrid = [...prevMazeGrid];


                newMazeGrid[loc[0]][loc[1]] =
                    currentSelectedTool().value;

                if (goalLocation && !(goalLocation[0] === loc[0] && goalLocation[1] === loc[1]))
                    newMazeGrid[goalLocation[0]][goalLocation[1]] =
                        getBlockValue("eraser");

                return newMazeGrid;
            });

            setGoalLocation(loc);
        }
        else if (currentSelectedTool().name === "start") {

            setMazeGrid(prevMazeGrid => {
                let newMazeGrid = [...prevMazeGrid];


                newMazeGrid[loc[0]][loc[1]] =
                    currentSelectedTool().value;

                if (startLocation && !(startLocation[0] === loc[0] && startLocation[1] === loc[1]))
                    newMazeGrid[startLocation[0]][startLocation[1]] =
                        getBlockValue("eraser");

                return newMazeGrid;
            });

            setStartLocation(loc);
        }

        else {

            setMazeGrid(prevMazeGrid => {

                let newMazeGrid = [...prevMazeGrid];

                //prevents erasing the outer wall boundary
                if (
                    (loc[0] === 0 || loc[0] === mazeDims.rows - 1) ||
                    (loc[1] === 0 || loc[1] === mazeDims.cols - 1)
                )
                    return prevMazeGrid;

                newMazeGrid[loc[0]][loc[1]] =
                    currentSelectedTool().value;

                return newMazeGrid;
            })
        }
    }


    function selectTool(toolName) {
        setToolArray(prevToolArray => {
            return prevToolArray.map(tool => ({
                ...tool,
                active: tool.name === toolName
            }))
        })
    }

    function validateMaze() {
        let msg = [];
        if (goalLocation === null) {
            msg.push("Please select the goal location.");
        }
        if (startLocation === null) {
            msg.push("Please select the start location.");
        }
        if (modelParams.numEpisodes === 0) {
            msg.push("Number of episodes can't be 0.");
        }
        if (modelParams.numRounds === 0) {
            msg.push("Number of rounds can't be 0.");
        }
        return { message: msg, isValid: msg.length === 0 };
    }

    async function sendMazeDetails() {
        setLoadingState(1);
        const validRes = validateMaze();
        if (validRes.isValid === false) {
            for (const msg of validRes.message) {
                console.log(msg)
            }
            setLoadingState(0);
            return;
        }
        const modelConfigs = {
            ...modelParams,
            model: selectedModel
        }

        const response = await fetch("http://localhost:8000/api/configs/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mazeDimensions: mazeDims,
                mazeGrid: mazeGrid,
                modelConfigs: modelConfigs,
                goalLocation: goalLocation
            })
        });

        const policyRcvd = await response.json();

        setPolicy(policyRcvd.policy);

        console.log("bhej diya");
    }


    const navigate = useNavigate();


    /*
     * -------------------------
     * UI: ZOOM
     * -------------------------
     */

    function handleWheel(e) {
        // e.preventDefault();

        const zoomAmount = e.deltaY > 0 ? -0.03 : 0.03;

        setZoom(prev => {
            const next = prev + zoomAmount;
            return Math.min(Math.max(next, 0.5), 3);
        });
    }


    /*
     * -------------------------
     * UI: PAN
     * -------------------------
     */

    function handlePanStart(e) {

        // Don't start panning when clicking a cell
        if (e.target.closest(".cell"))
            return;

        setIsPanning(true);

        setPanStart({
            mouseX: e.clientX,
            mouseY: e.clientY,
            panX: pan.x,
            panY: pan.y
        });
    }


    function handlePanMove(e) {

        if (!isPanning || !panStart)
            return;

        setPan({
            x: panStart.panX + (e.clientX - panStart.mouseX),
            y: panStart.panY + (e.clientY - panStart.mouseY)
        });
    }


    function handlePanEnd() {
        setIsPanning(false);
        setPanStart(null);
    }


    /*
     * -------------------------
     * UI: CUSTOM CURSOR
     * -------------------------
     */

    function handleMazeMouseMove(e) {

        const rect = e.currentTarget.getBoundingClientRect();

        setCursor({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            visible: true,
            blocked: (e.target.closest(".maze-wall") !== null)
                || (currentSelectedTool().name !== "eraser" && e.target.closest(".path") === null)
            // blocked: (e.target.closest(".maze-wall") !== null
            //     || e.target.closest(".wall") !== null
            //     || ((currentSelectedTool().name === "wall") // if the tool is wall and cell is the goal state
            //         && e.target.closest(".goal")))
        });
    }


    function hideCursor() {
        setCursor(prev => ({
            ...prev,
            visible: false
        }));
    }


    const mazeGridCells = mazeGrid?.flat().map((item, idx) => {

        const rowNum = Math.floor(idx / mazeDims.cols);
        const colNum = idx % mazeDims.cols;

        const isOuterWall =
            rowNum === 0 ||
            rowNum === mazeDims.rows - 1 ||
            colNum === 0 ||
            colNum === mazeDims.cols - 1;

        return (
            <div
                key={`wrapper-r${rowNum}-c${colNum}`}
                className={isOuterWall ? "maze-wall" : ""}
                style={{ display: "contents" }}
            >
                <Cell
                    key={`r${rowNum}-${colNum}`}
                    loc={[rowNum, colNum]}
                    isStart={startLocation[0] === rowNum && startLocation[1] === colNum}
                    value={item}
                    handleClick={fillCell}
                />
            </div>
        );
    }) ?? null;


    const toolBarCells = toolArray.map((tcell, idx) =>
        <ToolBarCell
            key={idx}
            name={tcell.name}
            icon={tcell.icon}
            value={tcell.value}
            active={tcell.active}
            onClick={selectTool}
        />
    );

    function acceptParams() {
        setModelParams(prevParams => {
            return draftParamsRef.current;
        })
        setShowParams(false);
    }

    if (mazeDims === null) {
        return (
            <Fallback />
        )
    }


    const selectedTool = currentSelectedTool();
    // console.log(selectedTool);

    // console.log("draft params : ",draftParamsRef.current)
    // console.log("model params : ",modelParams)

    return (
        <div className="build-page">

            <div
                className={`maze-viewport ${isPanning ? "panning" : ""
                    } ${selectedTool ? "tool-selected" : ""}`}
                onWheel={handleWheel}
                onMouseDown={handlePanStart}
                onMouseMove={(e) => {
                    handlePanMove(e);
                    handleMazeMouseMove(e);
                }}
                onMouseUp={handlePanEnd}
                onMouseLeave={() => {
                    handlePanEnd();
                    hideCursor();
                }}
                onMouseEnter={(e) => {
                    handleMazeMouseMove(e);
                }}
            >

                <div
                    className="maze-transform"
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                    }}
                >

                    <div
                        className="maze-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                `repeat(${mazeDims?.cols ?? 0}, 32px)`
                        }}
                    >
                        {mazeGridCells}
                    </div>

                </div>


                {selectedTool && cursor.visible && (
                    <div
                        className={`build-cursor ${cursor.blocked ? "blocked" : ""}`}
                        style={{
                            left: cursor.x,
                            top: cursor.y
                        }}
                    >
                        {cursor.blocked
                            ? <FaBan />
                            : <img src={selectedTool.spriteSrc} width={24} height={24} />
                            // : selectedTool.icon
                        }
                    </div>
                )}

            </div>


            <div className="build-toolbar">
                {toolBarCells}
            </div>


            <div className="build-actions">

                <button onClick={sendMazeDetails} disabled={loadingState}>
                    {(loadingState == 0) ? "RUN." : "Generating Policy ..."}
                </button>

            </div>

            <div className="model-controls">

                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                >
                    <option value="SARSA">SARSA</option>
                    <option value="MC">MONTE CARLO</option>
                </select>

                <button onClick={() => setShowParams(true)}>
                    PARAMETERS
                </button>

            </div>

            {showParams && (

                <div className="params-dialog">

                    <button
                        className="params-close"
                        onClick={() => setShowParams(false)}
                    >
                        ×
                    </button>

                    <h2>TUNING</h2>

                    <div className="param-field">
                        <label htmlFor="numEpisodes">
                            numEp:
                        </label>

                        <input
                            id="numEpisodes"
                            type="number"
                            min="1"
                            defaultValue={modelParams.numEpisodes}
                            onChange={(e) => { draftParamsRef.current.numEpisodes = Number(e.target.value) }}
                        />
                    </div>


                    <div className="param-field">
                        <label htmlFor="numRounds">
                            numRounds:
                        </label>

                        <input
                            id="numRounds"
                            type="number"
                            min="1"
                            defaultValue={modelParams.numRounds}
                            onChange={(e) => { draftParamsRef.current.numRounds = Number(e.target.value) }}
                        />
                    </div>


                    {selectedModel === "MC" && <div className="slider-field">
                        <label htmlFor="epsilon">
                            ɛ:
                        </label>

                        <input
                            id="epsilon"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            defaultValue={`${modelParams.epsilon}`}
                            onChange={(e) => { draftParamsRef.current.epsilon = Number(e.target.value) }}
                        />
                    </div>}


                    <div className="slider-field">
                        <label htmlFor="gamma">
                            γ:
                        </label>

                        <input
                            id="gamma"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            defaultValue={`${modelParams.gamma}`}
                            onChange={(e) => { draftParamsRef.current.gamma = Number(e.target.value) }}

                        />
                    </div>


                    <div className="params-actions">

                        <button
                            className="params-accept"
                            onClick={acceptParams}
                        >
                            ✓
                        </button>

                        <button
                            className="params-discard"
                            onClick={() => {
                                setShowParams(false);
                            }}
                        >
                            ×
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}