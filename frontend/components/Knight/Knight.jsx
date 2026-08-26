import './Knight.css'
import clsx from 'clsx'

export default function Knight({state, direction, position}) {

    const stateClass = clsx('knight', state.toLowerCase(), direction.toLowerCase());
    // console.log(stateClass)

    return (
        <div
            className={stateClass}
            style={{
                top: `${32*position[0]}px`,
                left: `${32*position[1]}px`,
            }}
            // onClick={()=>{props.handleClick(props.loc, props.value)}} 
        >
            {/* {direction} */}
        </div>
    );
}