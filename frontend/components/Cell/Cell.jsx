import './Cell.css'
import clsx from 'clsx'
import { getBlockValue } from '../../tools';

export default function Cell(props) {

    const tileClass = clsx('cell', {
        'wall':props.value==getBlockValue("wall"),
        'path':props.value==getBlockValue("eraser"),
        'goal':props.value==getBlockValue("goal")
    })

    return (
        <div
            className={tileClass}
            onClick={()=>{props.handleClick(props.loc, props.value)}}
        >
        </div>
    );
}