import { FaMountain, FaEraser } from "react-icons/fa";
import { GiBrickWall, GiGolfFlag } from "react-icons/gi";
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
        name: "goal",
        icon: <GiGolfFlag />,
        value: 100,

    },
];

export function getBlockValue(blockName) {
        for (const elem of tools) {
            if (elem.name === blockName) {
                return elem.value;
            }
        }
        
    }