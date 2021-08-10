import React, {useRef} from "react"
import Tooltip from "./Tooltip"

type TooltipRefRelativeType = {
    activeNodeRef: React.RefObject<HTMLDivElement> | null
    freeze: boolean
    options: [React.ReactElement, React.ReactElement][]
}

const TooltipRefRelative: React.FC<TooltipRefRelativeType> = (props) => {

    const ref = useRef<HTMLDivElement>(null)

    return (
        <div className={"TooltipRefRelative"} ref={ref}>
            <Tooltip
                top={() => {
                    const thisOne = ref.current
                    const top = (
                        (props.activeNodeRef && props.activeNodeRef.current
                            ? props.activeNodeRef.current.getBoundingClientRect().top
                            : NaN) -
                        (thisOne? thisOne.getBoundingClientRect().top : NaN)
                    )
                    return Math.max(top || 0, 45)
                }}
                freeze={props.freeze}
                options={props.options}
            />
        </div>
    )
}

export default TooltipRefRelative
