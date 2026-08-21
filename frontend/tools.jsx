import { FaMountain, FaEraser } from "react-icons/fa";
import { GiBrickWall, GiGolfFlag, GiMagicGate } from "react-icons/gi";
import { GiGrass } from "react-icons/gi";

export const tools = [
    {
        name: "wall",
        icon: <GiBrickWall />,
        value: -10,
        spriteSrc: "../../assets/wall.png"
    },
    {
        name: "eraser",
        icon: <FaEraser />,
        value: -0.1,
        spriteSrc: "../../assets/hammer_tool.png"

    },
    {
        name: "start",
        icon: <GiMagicGate />,
        value: -0.1,
        spriteSrc: "../../assets/start.png"

    },
    {
        name: "goal",
        icon: <GiGolfFlag />,
        value: 10,
        spriteSrc: "../../assets/goal.png"
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