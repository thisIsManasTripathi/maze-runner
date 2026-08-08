import './Cell.css'
import clsx from 'clsx'

export default function Cell(props) {

    const tileClass = clsx('cell', {
        'wall':props.value==-10,
        'path':props.value==-0.1,
        'goal':props.value==100
    })

    return (
        <div
            className={tileClass}
            onClick={()=>{props.handleClick(props.loc, props.value)}}
        >
        </div>
    );
}