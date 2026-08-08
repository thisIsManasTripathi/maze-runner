import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Cell from "../components/Cell/Cell";
import ToolBarCell from "../components/ToolBarCell/ToolBarCell";
import { tools } from "../tools";

export default function Build() {


    const [mazeDims, setMazeDims] = useState(null);
    const [mazeGrid, setMazeGrid] = useState(null);
    const [toolArray, setToolArray] = useState(tools);
    const [selectedTool, setSelectedTool] = useState(null); //this will hold the object;
    const [goalLocation, setGoalLocation] = useState(null);
    const location = useLocation();

    function buildEmptyWorld(rows, cols) {
        return Array.from({ length: rows }, (_, r) => {
            return Array.from({ length: cols }, (_, c) => {
                if ((r == 0 || r == rows - 1) || (c == 0 || c == cols - 1)) return -10;
                else return -0.1;
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

    function fillCell(loc, value) {
        console.log("cell with loc, val : ", loc, value);
        // console.log(selectedTool)
        if (selectedTool == 100) {
            // console.log("yeayyy")
            if (mazeGrid[loc[0]][loc[1]] != -10) {
                // console.log("kwfklsfjl")
                console.log(loc, goalLocation)
                setMazeGrid(prevMazeGrid => {
                    let newMazeGrid = [...prevMazeGrid];
                    newMazeGrid[loc[0]][loc[1]] = selectedTool;
                    if (goalLocation) newMazeGrid[goalLocation[0]][goalLocation[1]] = -0.1;
                    return newMazeGrid;
                });
                setGoalLocation(loc);
            }
        }
        else {
            setMazeGrid(prevMazeGrid => {
                let newMazeGrid = [...prevMazeGrid];
                if ((loc[0] == 0 || loc[0] == mazeDims.rows - 1) || (loc[1] == 0 || loc[1] == mazeDims.cols - 1)) return prevMazeGrid;
                newMazeGrid[loc[0]][loc[1]] = selectedTool;
                return newMazeGrid;
            })
        }
    }


    function selectTool(toolValue) {
        let selTool;
        for (const item of toolArray) {
            if (item.value == toolValue) {
                selTool = { ...item };
            }
        }

        setSelectedTool(selTool.value);

        setToolArray(prevToolArray => {
            let newToolArray = [...prevToolArray];
            for (const element of newToolArray) {
                element.active = (element.value == selTool.value)
                // if (element.value == selTool.value) element.active = true;
                // else element.active = false;
            }
            return newToolArray;
        })
    }

    async function sendMazeDetails() {
        await fetch("http://localhost:8000/api/configs/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mazeDimensions: mazeDims, mazeGrid: mazeGrid })
        });
        console.log("bhej diya")
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

    //   console.log(mazeGrid);
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
    console.log("sel tool with value : ", selectedTool);


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
        </div>
    );
}