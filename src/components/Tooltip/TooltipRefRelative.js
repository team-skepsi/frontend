import React, {useRef} from "react"
import Tooltip from "./Tooltip"

const TooltipRefRelative = (props) => {

    const ref = useRef(null)

    return (
        <div id={"TooltipRefRelative"} ref={ref}>
            <Tooltip
                top={() => {
                    // const thisOne = document.getElementById("TooltipRefRelative")
                    try {
                        const top = (
                            (props.activeNodeRef? props.activeNodeRef.current.getBoundingClientRect().top: NaN) -
                            // (thisOne? thisOne.getBoundingClientRect().top : NaN)
                            (ref.current? ref.current.getBoundingClientRect().top: NaN)
                        )
                        return Math.max(top || 0, 45)
                    } catch (e) {
                        console.log(e)
                        return 45
                    }

                }}
                {...props}
            />
        </div>
    )
}

export default TooltipRefRelative
