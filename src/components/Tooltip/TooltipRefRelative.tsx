import React, {useRef} from "react"
import Tooltip from "./Tooltip"

type TooltipRefRelativeType = {
    activeNodeRef: React.RefObject<HTMLDivElement> | null
    options: [React.ReactElement, React.ReactElement][]
    onPrevious: () => void
    onNext: () => void
    activeResize: boolean
}

const TooltipRefRelative: React.FC<TooltipRefRelativeType> = (props) => {

    const ref = useRef<HTMLDivElement>(null)
    const {activeNodeRef, ...rest} = props

    return (
        <div className={"TooltipRefRelative"} ref={ref}>
            <Tooltip
                top={() => {
                    const thisOne = ref.current
                    const top = (
                        (activeNodeRef && activeNodeRef.current
                            ? activeNodeRef.current.getBoundingClientRect().top
                            : NaN) -
                        (thisOne? thisOne.getBoundingClientRect().top : NaN)
                    ) + 45
                    return Math.max(top || 0, 45)
                }}
                {...rest}
            />
        </div>
    )
}

export default TooltipRefRelative
