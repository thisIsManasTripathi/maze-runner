import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Cell from "../components/Cell/Cell";
import ToolBarCell from "../components/ToolBarCell/ToolBarCell";
import { tools, getBlockValue } from "../tools";

export default function Build() {


    const [mazeDims, setMazeDims] = useState(null);
    const [mazeGrid, setMazeGrid] = useState(null);
    const [toolArray, setToolArray] = useState(() => {
        return tools.map((item) => {
            return { ...item, active: false }
        })
    });
    const [goalLocation, setGoalLocation] = useState(null);
    const [policy, setPolicy] = useState(null);
    const location = useLocation();



    function buildEmptyWorld(rows, cols) {
        return Array.from({ length: rows }, (_, r) => {
            return Array.from({ length: cols }, (_, c) => {
                if ((r === 0 || r === rows - 1) || (c === 0 || c === cols - 1)) return getBlockValue("wall");
                else return getBlockValue("eraser");
            });
        })
    }

    useEffect(() => {

        const { rows, cols } = location.state;
        console.log(rows, cols);
        setMazeGrid((prev) => {
            const grid = buildEmptyWorld(rows + 2, cols + 2);
            // console.log("grid : ", grid);
            return grid;
        });
        setMazeDims({ rows: rows + 2, cols: cols + 2 });

    }, []);

    function currentSelectedTool() {
        for (const tool of toolArray) {
            if (tool.active === true) return tool;
        }
        return null;
    }

    function fillCell(loc, value) {
        // console.log("cell with loc, val : ", loc, value);
        // console.log(selectedTool)
        if (currentSelectedTool().name === "goal") {
            // console.log("yeayyy")
            if (mazeGrid[loc[0]][loc[1]] != getBlockValue("wall")) {
                // console.log("kwfklsfjl")
                
                console.log(loc, goalLocation)
                setMazeGrid(prevMazeGrid => {
                    let newMazeGrid = [...prevMazeGrid];
                    newMazeGrid[loc[0]][loc[1]] = currentSelectedTool().value;
                    if (goalLocation && goalLocation != loc) newMazeGrid[goalLocation[0]][goalLocation[1]] = getBlockValue("eraser");
                    return newMazeGrid;
                });
                setGoalLocation(loc);
            }
        }
        else {
            setMazeGrid(prevMazeGrid => {
                let newMazeGrid = [...prevMazeGrid];
                if ((loc[0] === 0 || loc[0] === mazeDims.rows - 1) || (loc[1] === 0 || loc[1] === mazeDims.cols - 1)) return prevMazeGrid;
                newMazeGrid[loc[0]][loc[1]] = currentSelectedTool().value;
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

    async function sendMazeDetails() {
        const response = await fetch("http://localhost:8000/api/configs/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mazeDimensions: mazeDims, mazeGrid: mazeGrid, goalLocation: goalLocation })
        });
        const policyRcvd =  await response.json();
        setPolicy(policyRcvd.policy);
        console.log("bhej diya");
    }
    
    const navigate = useNavigate();
    async function runMaze(){
        policy?navigate('/run', {state : {mazeDims: mazeDims, rewardMatrix: mazeGrid, policy:policy, goalLoc: goalLocation }}):console.log("meh")
    }
    
    const mazeGridCells = mazeGrid?.flat().map((item, idx) => {
        const rowNum = Math.floor(idx / mazeDims.cols);
        const colNum = idx % mazeDims.cols;
        return (
            <Cell
            key={`r${Math.floor(rowNum)}-${colNum}`}
            loc={[rowNum, colNum]}
            value={item}
            handleClick={fillCell}
            />
        );
    }) ?? null;
    
    //   console.log(mazeGrid);;
    
    const toolBarCells = toolArray.map((tcell, idx) =>
        <ToolBarCell
    key={idx}
    name={tcell.name}
    icon={tcell.icon}
    value={tcell.value}
    active={tcell.active}
    onClick={selectTool}
    />
)
    // console.log("sel tool with value : ", currentSelectedTool()?.value ?? "not selected yet");

    
    // console.log(policy);
    return (
        <div className="home">
            {/* <h1>Humble.</h1> */}
            <div className="maze-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${mazeDims?.cols ?? 0}, 32px)` }}>
                {mazeGridCells}
            </div>
            <div className="tool-bar">
                {toolBarCells}
            </div>
            <button onClick={sendMazeDetails}>Send Details</button>
            <button onClick={runMaze}>RUN</button>
        </div>
    );
}