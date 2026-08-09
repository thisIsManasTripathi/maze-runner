import clsx from 'clsx'
import './RunCell.css'
import { getBlockValue } from '../../tools';

export default function RunCell(props) {
    const stateClass = clsx('run-cell', {
        'active': props.active,
        'wall': props.value == getBlockValue("wall"),
        'path': props.value == getBlockValue("eraser"),
        'goal': props.value == getBlockValue("goal")
    })

    return (
        <div className={stateClass}>
            {/* <span className="cell-reward">
                {value}
            </span> */}

            {/* {policy && (
                <span className="cell-policy">
                    {policy}
                </span>
            )} */}
        </div>
    );
}
