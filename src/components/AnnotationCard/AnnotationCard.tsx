import React, {useState, useEffect, useContext} from "react"
import MDEditor from "../MDEditor/MDEditor"
import ContentBlock from "../ContentBlock/ContentBlock"
import {mdToNode} from "../processing"
import styles from "./AnnotationCard.module.css"
import { gql, useMutation } from '@apollo/client'
import { UserContext } from '../../App.js'
import { useLocation } from 'react-router-dom'

const UPDATE_ANNOTATION = gql`
  mutation UpdateAnnotation($author: String, $quote: String, $content:String, $id: ID){
    updateAnnotation(annotationData:{author:$author, quote:$quote, content:$content, id:$id}){
    	annotation{
      	id
        author{
          username
        }
        quote
        content
      }
    }
  }
`
const CREATE_ANNOTATION = gql`
  mutation CreateAnnotation($author: String!, $quote: String, $content: String!, $paperId: ID!) {
    createAnnotation(author: $author, quote: $quote, content: $content, paperId: $paperId){
      annotation {
        id
        author {
          username
        }
        quote
        content
      }
    }
  }
`

const UPDATE_SCORE = gql`
  mutation UpdateScore($scoreId:ID!, $explanation: String, $scoreNumber: Int, $field: String){
    updateScore(scoreId:$scoreId, explanation: $explanation, scoreNumber: $scoreNumber, field: $field){
      score{
        id
        explanation
        scoreNumber
        field
      }
    }
  }
`

type SometimesEditableType = {
    text: string
    editable: boolean
    callback: (md: string | null) => void
    defaultText?: string

    // props handed to children
    editorProps?: React.ComponentProps<typeof MDEditor>
    contentBlockProps?: React.ComponentProps<typeof ContentBlock>
}

const SometimesEditable: React.FC<SometimesEditableType> = (props) => (
    props.editable
        ? <MDEditor {...props.editorProps} value={props.text} onMDChange={props.callback} />
        : <ContentBlock node={mdToNode(props.text || props.defaultText || "")} />
)

type ScoreBlockType = {
    category?: string
    scoreNumber?: number
    text?: string
}

export type AnnotationCardType = {
    id?: number
    activeAnnotation?: boolean
    author?: string
    date?: string
    text?: string
    scoreBlocks?: ScoreBlockType[]
    beingEdited?: boolean
    userCouldEdit?: boolean
    replies?: AnnotationCardType[]
    onReply?: () => void
    _depth?: number
    activeReply?: boolean
}

const AnnotationCard: React.FC<AnnotationCardType> = (props) => {
    const user = useContext(UserContext)
    const location = useLocation()

    const [updateAnnotation,
      {data: updateAnnotationData,
       error: updateAnnotationError,
       loading: updateAnnotationLoading
      }] = useMutation(UPDATE_ANNOTATION)

    const [createAnnotation,
      { data: createAnnotationData,
        loading: createAnnotationLoading,
        error: createAnnotationError
      }] = useMutation(CREATE_ANNOTATION)

    const [updateScore, {
      data: updateScoreData,
      loading: updateScoreLoading,
      error: updateScoreError
    }] = useMutation(UPDATE_SCORE)

    const categoryOptions = [
        '*no category*',
        'Validity',
        'Novelty',
        'Domain Importance',
    ]

    useEffect(()=>{
      console.log('ERROR!', updateScoreError)
    }, [updateScoreError])

    const [state, setState] = useState({
        id: props.id || NaN,
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
                {category: "select", scoreNumber: NaN, text: ""}
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
            console.log("saving to backend:", state)
            console.log("FINN TEST", typeof state.id)
            if(Number.isNaN(state.id)){
              console.log("This is a new annotation")
              console.log('STATE!', state)
              console.log("STUFF!", user['http://www.skepsi.com/username'], state.text, location.pathname.replace('/', ''))
              createAnnotation({variables: {
                author: user['http://www.skepsi.com/username'],
                quote: "",
                content: state.text,
                paperId: location.pathname.replace('/', '')
              }})
            }
            else{
              console.log("Updating an existing annotation")
              updateAnnotation({variables: {
                id: state.id,
                quote: "",
                content: state.text
              }})
            }
            for(let score of state.scoreBlocks){
              if(score.id && score.scoreNumber){
                console.log("SCORE STUFF", score.id, score.text, score.category, score.scoreNumber)
                updateScore({variables: {
                  scoreId: score.id,
                  explanation: score.text,
                  field: "Validity",
                  scoreNumber: score.scoreNumber,
                }})
                .then(response => console.log(response))
              }
              else{
                console.log("New score")
              }
            }
        } else {
            console.log("nothing to save")
        }
    }

    return (
        <div className={styles.main} style={depth%2===1? {backgroundColor: "lightgray"}: {}}>

            <div className={styles.header}>
                <div className={styles.author}>{state.author}</div>
                <div className={styles.headerSpacer}/>
                <div className={styles.date}>{state.date}</div>
            </div>

            <SometimesEditable
                editable={state.beingEdited}
                text={state.text}
                callback={md => setState({...state, text: md || ""})}
                defaultText={"...add details"}
                editorProps={{rows: 5, cols: 20}}/>

            <ul className={styles.scoreBlockList}>
                {Array.isArray(state.scoreBlocks) && state.scoreBlocks.map((sb, sbIndex) => (
                    <li key={sbIndex} className={styles.scoreBlockContainerEach}>
                        <div
                            className={styles.scoreBlockHeader}
                            onClick={() => state.beingEdited || toggleOpen(sbIndex)}>

                            <div className={styles.scoreBlockCategory}>
                                <select
                                    disabled={!state.beingEdited}
                                    value={sb.category}
                                    onChange={(e) =>
                                        editScoreBlock(sbIndex, {category: e.target.value})}>
                                    {categoryOptions.map((s, i) => <option key={i} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className={styles.headerSpacer}/>

                            <SometimesEditable
                                editable={state.beingEdited}
                                callback={(s) => editScoreBlock(sbIndex, {scoreNumber: parseInt(s || "")})}
                                text={sb.scoreNumber === undefined || isNaN(sb.scoreNumber)? "?": sb.scoreNumber.toString()}
                                editorProps={{rows: 1, cols: 2}}>
                            </SometimesEditable>

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
                            <button
                                className={styles.editButton}
                                onClick={() => {
                                    setState({...state, beingEdited: true})
                                    setOpenScoreBlocks(x => x.map(() => true))
                                }}>
                                Edit
                            </button>
                        }
                        <button className={styles.replyButton} onClick={props.onReply}>Reply</button>
                    </>
                }
            </div>

            {repliesOpen &&
            <div className={styles.childrenContainer}>
                {Array.isArray(props.replies) &&
                    props.replies.map(each =>
                        <AnnotationCard key={each.id} {...each} _depth={depth + 1}/>
                    )
                }
            </div>
            }

            {Boolean(props.replies && props.replies.length) &&
                (repliesOpen
                        ? <div className={styles.linkish} onClick={() => setRepliesOpen(false)}>hide replies</div>
                        : <div className={styles.linkish} onClick={() => setRepliesOpen(true)}>show replies</div>
                )
            }
        </div>
    )
}

export default AnnotationCard
