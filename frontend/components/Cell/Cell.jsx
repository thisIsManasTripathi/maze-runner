import './Cell.css'
import clsx from 'clsx'
import { getBlockValue } from '../../tools';
import { GiRotaryPhone } from 'react-icons/gi';

export default function Cell(props) {

    const tileClass = clsx('cell', {
        'wall':props.value==getBlockValue("wall"),
        'path':props.value==getBlockValue("eraser"),
        'start':props.isStart,
        'goal':props.value==getBlockValue("goal")
    })

    // if (props.isStart) console.log(props.loc)
    // if (props.value === getBlockValue("goal")) console.log("goal loc at ",props.loc)

    const rotations = [0, 90, 180, 270];

    return (
        <div
            className={tileClass}
            onClick={()=>{props.handleClick(props.loc, props.value)}}
            // style={{transform: `rotate(${rotations[Math.floor(Math.random() * (3 - 0 + 1)) + 0]}deg)`}}
        >
        </div>
    );
}