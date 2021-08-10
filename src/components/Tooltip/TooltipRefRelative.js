import React, {useRef} from "react"
import Tooltip from "./Tooltip"

const TooltipRefRelative = (props) => {

    const ref = useRef(null)

    return (
        <div className={"TooltipRefRelative"} id={"TooltipRefRelative"} ref={ref}>
            <Tooltip
                top={() => {
                    const thisOne = document.getElementById("TooltipRefRelative")
                    const top = (
                        (props.activeNodeRef && props.activeNodeRef.current
                            ? props.activeNodeRef.current.getBoundingClientRect().top
                            : NaN) -
                        (thisOne? thisOne.getBoundingClientRect().top : NaN)
                    )
                    return Math.max(top || 0, 45)
                }}
                {...props}
            />
        </div>
    )
}

export default TooltipRefRelative
