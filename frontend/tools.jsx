import { FaMountain, FaEraser } from "react-icons/fa";
import { GiBrickWall, GiGolfFlag, GiMagicGate } from "react-icons/gi";
import { GiGrass } from "react-icons/gi";

export const tools = [
    {
        name: "wall",
        icon: <GiBrickWall />,
        value: -10,
    },
    {
        name: "mud",
        icon: <GiGrass />,
        value: -0.25,

    },
    {
        name: "eraser",
        icon: <FaEraser />,
        value: -0.1,

    },
    {
        name: "start",
        icon: <GiMagicGate />,
        value: -0.1,

    },
    {
        name: "goal",
        icon: <GiGolfFlag />,
        value: 10,

    },
];

export function getBlockValue(blockName) {
        for (const elem of tools) {
            if (elem.name === blockName) {
                return elem.value;
            }
        }
        
}

export const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
export const gameStates = ["IDLE", "RUNNING", "DEAD", "VICTORY"];
export const moveStepDuration = 400;

export function getDirectionFromOffset([roff, coff]){
    console.log(roff, coff);
    if (roff !== 0) {
        if (roff === 1) return directions[1];
        else return directions[0];
    } else {
        if (coff === 1) return directions[3];
        else return directions[2];
    }
}