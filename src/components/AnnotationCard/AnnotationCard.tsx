import React, {useState, useEffect, useContext} from "react"
import MDEditor from "../MDEditor/MDEditor"
import ContentBlock from "../ContentBlock/ContentBlock"
import {mdToNode} from "../processing"
import styles from "./AnnotationCard.module.css"
import { gql, useMutation } from '@apollo/client'
import { UserContext, AuthenticationContext } from '../../App.js'
import { useLocation } from 'react-router-dom'
import { Dropdown, Modal } from 'semantic-ui-react'
import { GET_PAPER_AND_ANNOTATION_DATA } from '../PageManager/PageManager.js'

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

const DELETE_ANNOTATION = gql`
  mutation DeleteAnnotation($annotationId: ID!){
    deleteAnnotation(annotationId: $annotationId){
      annotation{
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

const CREATE_SCORE = gql`
  mutation CreateScore($annotationId: ID!, $scoreNumber: Int!, $explanation: String, $field: String){
    createScore(annotationId: $annotationId, scoreNumber: $scoreNumber, explanation: $explanation, field: $field){
      score{
        id
        explanation
        scoreNumber
        field
      }
    }
  }
`

const DELETE_SCORE = gql`
  mutation DeleteScore($scoreId:ID!){
    deleteScore(scoreId: $scoreId){
      score{
        explanation
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
    const isAuthenticated = useContext(AuthenticationContext)
    const location = useLocation()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [updateAnnotation,
      {data: updateAnnotationData,
       error: updateAnnotationError,
       loading: updateAnnotationLoading
     }] = useMutation(UPDATE_ANNOTATION, {
       refetchQueries: [
         {query: GET_PAPER_AND_ANNOTATION_DATA,
         variables: {paperId: location.pathname.replace('/', '')}},
       ]
     })

    const [createAnnotation,
      { data: createAnnotationData,
        loading: createAnnotationLoading,
        error: createAnnotationError
      }] = useMutation(CREATE_ANNOTATION, {
        refetchQueries: [
          {query: GET_PAPER_AND_ANNOTATION_DATA,
          variables: {paperId: location.pathname.replace('/', '')}},
        ]
      })

    const [updateScore, {
      data: updateScoreData,
      loading: updateScoreLoading,
      error: updateScoreError
    }] = useMutation(UPDATE_SCORE, {
      refetchQueries: [
        {query: GET_PAPER_AND_ANNOTATION_DATA,
        variables: {paperId: location.pathname.replace('/', '')}},
      ]
    })

    const [createScore, {
      data: createScoreData,
      loading: createScoreLoading,
      error: createScoreError
    }] = useMutation(CREATE_SCORE, {
      refetchQueries: [
        {query: GET_PAPER_AND_ANNOTATION_DATA,
        variables: {paperId: location.pathname.replace('/', '')}},
      ]
    })

    const [deleteScore, {
      data: deleteScoreData,
      loading: deleteScoreLoading,
      error: deleteScoreError
    }] = useMutation(DELETE_SCORE, {
      refetchQueries: [
        {query: GET_PAPER_AND_ANNOTATION_DATA,
        variables: {paperId: location.pathname.replace('/', '')}}
      ]
    })

    const [deleteAnnotation, {
      data: deleteAnnotationData,
      loading: deleteAnnotationLoading,
      error: deleteAnnotationError
    }] = useMutation(DELETE_ANNOTATION, {
      refetchQueries: [
        {query: GET_PAPER_AND_ANNOTATION_DATA,
        variables: {paperId: location.pathname.replace('/', '')}},
      ]
    })

    const categoryOptions = [
      {
        value: "Validity",
        text: "Validity",
        key: "Validity",

      },
      {
        value: "Novelty",
        text: "Novelty",
        key: "Novelty"
      },
      {
        value: "Domain Importance",
        text: "Domain Importance",
        key: "Domain Importance"
      },
    ]

    const [state, setState] = useState({
        id: props.id || NaN,
        author: props.author || "",
        date: props.date || "",
        text: props.text || "",
        scoreBlocks: props.scoreBlocks || [],
        beingEdited: props.beingEdited || false,
    })

    useEffect(()=>{
      console.log('STATE!', state)
    }, [state])

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
                {category: "", scoreNumber: NaN, text: ""}
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
        deleteScore({ variables: {
          scoreId: state.scoreBlocks[`${sbIndex}`].id
        }})
    }

    const editScoreBlock = (sbIndex: number, newVals: ScoreBlockType) => {
        console.log('NEWVALS', newVals)
        setState(prevState => {
            const newScoreBlocks = [...prevState.scoreBlocks]
            newScoreBlocks[sbIndex] = {...newScoreBlocks[sbIndex], ...newVals}
            let state = Object.assign({}, prevState)
            state.scoreBlocks = newScoreBlocks
            console.log('HII!!', newScoreBlocks)
            return { ...state }
        })
    }

    const onSave = (sbIndex) => {
      console.log('SCORE INDEX!', sbIndex)
        setState({...state, beingEdited: false})
        if (isEdited()){
          console.log('STATE!', state)
          if(Number.isNaN(state.id)){
            console.log("This is a new annotation")
            createAnnotation({variables: {
              author: user['http://www.skepsi.com/username'],
              quote: "",
              content: state.text,
              paperId: location.pathname.replace('/', '')
            }})
            .then(response => {
              for(let score of state.scoreBlocks ){
                if(score.category && score.scoreNumber){
                  console.log("Creating a new score")
                  createScore({variables: {
                    author: user['http://www.skepsi.com/username'],
                    scoreNumber: score.scoreNumber,
                    field: score.category,
                    explanation: score.text,
                    annotationId: response.data ? response.data.createAnnotation.annotation.id : undefined
                  }})
                }
              }
            })
          }
          else{
            console.log("Updating an existing annotation")
            updateAnnotation({ variables: {
              id: state.id,
              quote: "",
              content: state.text
            }})
            .then(response => {
              for(let score of state.scoreBlocks){
                if(score.id){
                  // OLD SCORE UPDATE
                  console.log("Updating an existing score")
                  updateScore({ variables: {
                    scoreId: score.id,
                    explanation: score.text,
                    field: score.category,
                    scoreNumber: score.scoreNumber,
                  }})
                }
                else {
                  createScore({ variables: {
                    author: user['http://www.skepsi.com/username'],
                    scoreNumber: score.scoreNumber,
                    field: score.category,
                    explanation: score.text,
                    annotationId: state.id
                  }})
                }
              }
            })
          }
        }
        else {
            console.log("nothing to save")
        }
    }

    function onDelete(){
      setDeleteModalOpen(false)
      deleteAnnotation({variables: {
        annotationId: state.id
      }})
    }

    return (
        <div className={styles.main} style={depth%2===1? {backgroundColor: "lightgray"}: {}}>

            <div className={styles.header}>
                <div className={styles.author}>
                  {state.author === user['http://www.skepsi.com/username'] || state.author === "???" ? "me" : state.author}
                </div>
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
                                <Dropdown
                                    placeholder={state.scoreBlocks.field ? state.scoreBlocks.field : "Please select a field"}
                                    selection
                                    disabled={!state.beingEdited}
                                    options={categoryOptions}
                                    onChange={(e) =>
                                         editScoreBlock(sbIndex, {category: e.target.innerText})} />
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
                    {isAuthenticated &&
                      <>
                        <button className={styles.addScoreBlockButton} onClick={addScoreBlock}>Add Score</button>
                        <button className={styles.saveButton} onClick={onSave}>Save</button>
                      </>
                    }
                    {!isAuthenticated &&
                      <>
                      <button className={styles.addScoreBlockButton} onClick={()=>alert("You must sign in to add scores")}>Add Score</button>
                      <button className={styles.saveButton} onClick={()=>alert("You must sign in to save annotations")}>Save</button>
                      </>
                    }
                    </>
                    : <>
                        {state.author === user['http://www.skepsi.com/username'] &&
                            <button
                                className={styles.editButton}
                                onClick={()  => {
                                    setState({...state, beingEdited: true})
                                    setOpenScoreBlocks(x => x.map(() => true))
                                }}>
                                Edit
                            </button>
                        }

                        {state.author === user['http://www.skepsi.com/username'] &&
                          <button
                            className={styles.editButton}
                            onClick={()=>{setDeleteModalOpen(true)}}
                            >Delete
                          </button>
                        }
                        <Modal
                          onClose={()=>setDeleteModalOpen(false)}
                          onOpen={()=>setDeleteModalOpen(true)}
                          open={deleteModalOpen}
                          >
                          <Modal.Content>
                            Are you sure you want to delete this annotation?
                          </Modal.Content>
                          <Modal.Actions>
                            <button onClick={onDelete}>Yes</button>
                            <button onClick={()=>setDeleteModalOpen(false)}>No</button>
                          </Modal.Actions>
                        </Modal>
                        {isAuthenticated &&
                          <button className={styles.replyButton} onClick={props.onReply}>Reply</button>
                        }
                        {!isAuthenticated &&
                          <button className={styles.replyButton} onClick={()=>alert('Please log in or sign up to comment')}>Reply</button>
                        }
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
