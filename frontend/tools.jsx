import { FaMountain, FaEraser } from "react-icons/fa";
import { GiBrickWall } from "react-icons/gi";
import { GiGrass } from "react-icons/gi";

export const tools = [
    {
        name: "Wall",
        icon: <GiBrickWall />,
        value: -100,
        active: false
    },
    {
        name: "Mud",
        icon: <GiGrass />,
        value: -2,
        active: false

    },
    {
        name: "Eraser",
        icon: <FaEraser />,
        value: -1,
        active: false

    },
];