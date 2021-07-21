import React, {useState} from "react"
import MDEditor from "../MDEditor/MDEditor"
import ContentBlock from "../ContentBlock/ContentBlock"
import {mdToNode} from "../processing"
import styles from "./AnnotationCard.module.css"

const SometimesEditable: React.FC<{text: string, editable: boolean, callback: (md: string | null) => void, defaultText?: string}> = ({text, editable, callback, defaultText}) => (
    editable
        ? <MDEditor value={text} onMDChange={callback} />
        : <ContentBlock node={mdToNode(text || defaultText || "")} />
)

type ScoreBlockType = {
    category?: string
    score?: number
    text?: string
}

export type AnnotationCardType = {
    id?: number
    author?: string
    date?: string
    text?: string
    scoreBlocks?: ScoreBlockType[]
    beingEdited?: boolean
    userCouldEdit?: boolean
    replies?: AnnotationCardType[]
    onReply?: () => void
    _depth?: number
}

const AnnotationCard: React.FC<AnnotationCardType> = (props) => {

    const [state, setState] = useState({
        author: props.author || "",
        date: props.date || "",
        text: props.text || "",
        scoreBlocks: props.scoreBlocks || [],
        beingEdited: props.beingEdited || false,
    })

    // depth is used in a number of styling decisions
    const depth = props._depth || 0

    // tracks whether the children are currently visible
    const [repliesOpen, setRepliesOpen] = useState(depth < 3)

    // tracks which score blocks are currently opened by the user
    const [openScoreBlocks, setOpenScoreBlocks] = useState(Array.isArray(state.scoreBlocks)
        ? state.scoreBlocks.map(() => depth < 2)
        : []
    )
    const toggleOpen = (sbIndex: number) => setOpenScoreBlocks(open => open.map((each, i) => i === sbIndex? !each: each))

    const isEdited = () => JSON.stringify(props) !== JSON.stringify(state)

    const addScoreBlock = () => {
        setState(state => ({
            ...state,
            scoreBlocks: [
                ...state.scoreBlocks,
                {category: "select", score: NaN, text: ""}
            ]
        }))
        setOpenScoreBlocks(open => [...open, true])
    }

    const removeScoreBlock = (sbIndex: number) => {
        setState({
            ...state,
            scoreBlocks: state.scoreBlocks.slice(0, sbIndex).concat(state.scoreBlocks.slice(sbIndex + 1))
        })
        setOpenScoreBlocks(openScoreBlocks.slice(0, sbIndex).concat(openScoreBlocks.slice(sbIndex + 1)))
    }

    const editScoreBlock = (sbIndex: number, newVals: ScoreBlockType) => {
        setState(state => {
            const newScoreBlocks = [...state.scoreBlocks]
            newScoreBlocks[sbIndex] = {...newScoreBlocks[sbIndex], ...newVals}
            return {...state, scoreBlocks: newScoreBlocks}
        })
    }

    const onSave = () => {
        setState({...state, beingEdited: false})
        if (isEdited()){
            alert("saving to backend: " + JSON.stringify(state))
        } else {
            alert("nothing to save")
        }
    }

    return (
        <div className={styles.main} style={depth%2===1? {backgroundColor: "lightgray"}: {}}>

            {/*<button onClick={() => console.log(JSON.stringify(state, null, 4), openScoreBlocks)}>Inspect</button>*/}

            <div className={styles.header}>
                <div className={styles.author}>{state.author}</div>
                <div className={styles.headerSpacer}/>
                <div className={styles.date}>{state.date}</div>
            </div>

            <SometimesEditable
                editable={state.beingEdited}
                text={state.text}
                callback={md => setState({...state, text: md || ""})}
                defaultText={"...add details"}/>

            <ul className={styles.scoreBlockList}>
                {Array.isArray(state.scoreBlocks) && state.scoreBlocks.map((sb, sbIndex) => (
                    <li key={sbIndex} className={styles.scoreBlockContainerEach}>
                        <div
                            className={styles.scoreBlockHeader}
                            onClick={() => toggleOpen(sbIndex)}>
                            <div className={styles.scoreBlockCategory}>{sb.category}</div>
                            <div className={styles.headerSpacer}/>
                            <div className={styles.scoreBlockScore}>{sb.score === undefined || isNaN(sb.score)? "?": sb.score}</div>
                            {state.beingEdited &&
                            <button onClick={() => removeScoreBlock(sbIndex)}>delete</button>}
                        </div>

                        {openScoreBlocks[sbIndex] &&
                            <div className={styles.scoreBlockTextContainer}>
                                <SometimesEditable
                                    editable={state.beingEdited}
                                    text={sb.text || ""}
                                    callback={(md) => editScoreBlock(sbIndex, {text: md || ""})}
                                    defaultText={"...add details"}/>
                            </div>
                        }
                    </li>
                ))}
            </ul>

            {Boolean(state.scoreBlocks && (state.scoreBlocks.length > 0)) &&
                (openScoreBlocks.filter(x => x).length > 0
                    ? <div className={styles.linkish} onClick={() => setOpenScoreBlocks(open => open.map(() => false))}>close all</div>
                    : <div className={styles.linkish} onClick={() => setOpenScoreBlocks(open => open.map(() => true))}>expand all</div>
                )
            }

            <div className={styles.buttonRow}>
                {state.beingEdited
                    ? <>
                        <button className={styles.addScoreBlockButton} onClick={addScoreBlock}>Add Score</button>
                        <button className={styles.saveButton} onClick={onSave}>Save</button>
                    </>
                    : <>
                        {props.userCouldEdit &&
                            <button className={styles.editButton} onClick={() => setState({...state, beingEdited: true})}>
                                Edit
                            </button>
                        }
                        <button className={styles.replyButton} onClick={props.onReply}>Reply</button>
                    </>}
            </div>

            {repliesOpen &&
                <div className={styles.childrenContainer}>
                    {Array.isArray(props.replies) &&
                        props.replies.map(each => <AnnotationCard {...each} _depth={depth + 1}/>)
                    }
                </div>
            }

            {props.replies &&
                (repliesOpen
                        ? <div className={styles.linkish} onClick={() => setRepliesOpen(false)}>hide replies</div>
                        : <div className={styles.linkish} onClick={() => setRepliesOpen(true)}>show replies</div>
                )
            }
        </div>
    )
}

export default AnnotationCard
