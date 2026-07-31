import './Cell.css'
import clsx from 'clsx'

export default function Cell(props) {

    const tileClass = clsx('cell', {
        'wall':props.value==-100,
        'path':props.value==-1
    })

    return (
        <div
            className={tileClass}
            onClick={()=>{props.handleClick(props.loc, props.value)}}
        >
        </div>
    );
}