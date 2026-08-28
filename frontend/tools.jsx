export const tools = [
    {
        name: "wall",
        value: -10,
        spriteSrc: "/assets/wall.png"
    },
    {
        name: "eraser",
        value: -0.1,
        spriteSrc: "/assets/hammer_tool.png"

    },
    {
        name: "start",
        value: -0.1,
        spriteSrc: "/assets/start.png"

    },
    {
        name: "goal",
        value: 10,
        spriteSrc: "/assets/goal.png"
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
    // console.log(roff, coff);
    if (roff !== 0) {
        if (roff === 1) return directions[1];
        else return directions[0];
    } else {
        if (coff === 1) return directions[3];
        else return directions[2];
    }
}