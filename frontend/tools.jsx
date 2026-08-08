import { FaMountain, FaEraser } from "react-icons/fa";
import { GiBrickWall, GiGolfFlag } from "react-icons/gi";
import { GiGrass } from "react-icons/gi";

export const tools = [
    {
        name: "Wall",
        icon: <GiBrickWall />,
        value: -10,
        active: false
    },
    {
        name: "Mud",
        icon: <GiGrass />,
        value: -0.25,
        active: false

    },
    {
        name: "Eraser",
        icon: <FaEraser />,
        value: -0.1,
        active: false

    },
    {
        name: "Goal",
        icon: <GiGolfFlag />,
        value: 100,
        active: false

    },
];