import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Cell from "../components/Cell/Cell";
import ToolBarCell from "../components/ToolBarCell/ToolBarCell";
import { tools } from "../tools";

export default function Build() {


    const [mazeDims, setMazeDims] = useState(null);
    const [mazeGrid, setMazeGrid] = useState(null);
    const [toolArray, setToolArray] = useState(tools);
    const [selectedTool, setSelectedTool] = useState(null); //this will just hold the value;

    const location = useLocation();

    function buildEmptyWorld(rows, cols) {
        return Array.from({ length: rows }, (_, r) => {
            return Array.from({ length: cols }, (_, c) => {
                if ((r == 0 || r == rows - 1) || (c == 0 || c == cols - 1)) return -100;
                else return -1;
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
        setMazeGrid(prevMazeGrid => {
            let newMazeGrid = [...prevMazeGrid];
            if ((loc[0] == 0 || loc[0] == mazeDims.rows - 1) || (loc[1] == 0 || loc[1] == mazeDims.cols - 1)) return prevMazeGrid;
            newMazeGrid[loc[0]][loc[1]] = selectedTool;
            return newMazeGrid;
        })
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
    console.log("sel tool with value : ", selectedTool);


    return (
        <div className="home">
            {/* <h1>Humble.</h1> */}
            <div className="maze-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${mazeDims?.cols ?? 0}, 32px)` }}>
                {mazeGridCells}
            </div>
            <div className="tool-bar">
                <ToolBarCell
                    // tool={toolArray[0]}
                    name={toolArray[0].name}
                    icon={toolArray[0].icon}
                    value={toolArray[0].value}
                    active={toolArray[0].active}
                    onClick={selectTool}
                />
                <ToolBarCell
                    // tool={toolArray[0]}
                    name={toolArray[1].name}
                    icon={toolArray[1].icon}
                    value={toolArray[1].value}
                    active={toolArray[1].active}
                    onClick={selectTool}
                />
                <ToolBarCell
                    // tool={toolArray[0]}
                    name={toolArray[2].name}
                    icon={toolArray[2].icon}
                    value={toolArray[2].value}
                    active={toolArray[2].active}
                    onClick={selectTool}
                />
            </div>

        </div>
    );
}