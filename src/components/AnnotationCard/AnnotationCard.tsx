import React, {useContext, useState, useEffect} from "react"
import MDEditor from "../MDEditor/MDEditor"
import ContentBlock from "../ContentBlock/ContentBlock"
import {mdToNode} from "../processing"
import styles from "./AnnotationCard.module.css"
import {gql, useMutation} from '@apollo/client'
import {AuthenticationContext, UserContext} from '../../App.js'
import {useLocation} from 'react-router-dom'
import {Dropdown, Modal, Icon, Button} from 'semantic-ui-react'
import {GET_PAPER_AND_ANNOTATION_DATA} from '../PageManager/PageManager.js'
import {AnnotationType} from "../types"
import { isNotEmpty, scoreIsIntegerBetweenOneAndTen } from './validators.js'
import { titleize } from '../../utility/StringManipulation.js'
import {useStateWithCallbackLazy} from "use-state-with-callback";

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
    mutation CreateAnnotation($start: Int!, $stop: Int!, $author: String!, $quote: String, $content: String!, $paperId: ID!, $parentId: ID) {
        createAnnotation(start: $start, stop: $stop, author: $author, quote: $quote, content: $content, paperId: $paperId, parentId: $parentId){
            annotation {
                id
                author {
                    username
                }
                quote
                content
                start
                stop
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
        ? <MDEditor {...props.editorProps} value={props.text} onMDChange={props.callback}/>
        : <ContentBlock node={mdToNode(props.text || props.defaultText || "")}/>
)

type ScoreBlockType = {
    id?: number
    field?: string
    scoreNumber?: number
    explanation?: string
}

export type AnnotationCardType = {
    id?: number
    start?: number
    stop?: number
    activeHighlight?: boolean
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
    annotation?: AnnotationType
    parentId?: number
}

type SecretRealAnnotationCardType = AnnotationCardType & {
    nodeRef?: React.RefObject<HTMLDivElement>
    active?: boolean
    onClick?: React.MouseEventHandler
    killActiveSelection?: () => void
    onChange?: () => void
}

const AnnotationCard: React.FC<SecretRealAnnotationCardType> = (props) => {
    const user = useContext(UserContext)
    const isAuthenticated = useContext(AuthenticationContext)
    const location = useLocation()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [createAnnotation, { error: createAnnotationError}] = useMutation(CREATE_ANNOTATION, {
        refetchQueries: [
            {
                query: GET_PAPER_AND_ANNOTATION_DATA,
                variables: {paperId: location.pathname.replace('/', '')}
            },
        ]
    })

    const [updateAnnotation, { error: updateAnnotationError}] = useMutation(UPDATE_ANNOTATION, {
        refetchQueries: [
            {
                query: GET_PAPER_AND_ANNOTATION_DATA,
                variables: {paperId: location.pathname.replace('/', '')}
            },
        ]
    })

    const [deleteAnnotation, { error: deleteAnnotationError}] = useMutation(DELETE_ANNOTATION, {
        refetchQueries: [
            {
                query: GET_PAPER_AND_ANNOTATION_DATA,
                variables: {paperId: location.pathname.replace('/', '')}
            },
        ]
    })

    const [createScore, { error: createScoreError}] = useMutation(CREATE_SCORE, {
        refetchQueries: [
            {
                query: GET_PAPER_AND_ANNOTATION_DATA,
                variables: {paperId: location.pathname.replace('/', '')}
            },
        ]
    })

    const [updateScore, { error: updateScoreError}] = useMutation(UPDATE_SCORE, {
        refetchQueries: [
            {
                query: GET_PAPER_AND_ANNOTATION_DATA,
                variables: {paperId: location.pathname.replace('/', '')}
            },
        ]
    })

    const [deleteScore, { error: deleteScoreError}] = useMutation(DELETE_SCORE, {
        refetchQueries: [
            {
                query: GET_PAPER_AND_ANNOTATION_DATA,
                variables: {paperId: location.pathname.replace('/', '')}
            }
        ]
    })

    const fieldOptions = [
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

    const scoreNumberOptions = [
      {
        value: 1,
        text: 1,
        key: 1,
      },
      {
        value: 2,
        text: 2,
        key: 2,
      },
      {
        value: 3,
        text: 3,
        key: 3,
      },
      {
        value: 4,
        text: 4,
        key: 4,
      },
      {
        value: 5,
        text: 5,
        key: 5,
      },
      {
        value: 6,
        text: 6,
        key: 6,
      },
      {
        value: 7,
        text: 7,
        key: 7,
      },
      {
        value: 8,
        text: 8,
        key: 8,
      },
      {
        value: 9,
        text: 9,
        key: 9,
      },
      {
        value: 10,
        text: 10,
        key: 10,
      },
    ]

    const [state, _setState] = useStateWithCallbackLazy({
        id: props.id || NaN,
        author: props.author || "",
        date: props.date || "",
        text: props.text || "",
        scoreBlocks: props.scoreBlocks || [],
        beingEdited: props.beingEdited || false,
        activeHighlight: props.activeHighlight,
        parentId: props.parentId
    })

    const setState = (val: typeof state | ((current: typeof state) => typeof state)) => {
        _setState(val, () => props.onChange && props.onChange())
    }

    // depth is used in a number of styling decisions
    const depth = props._depth || 0

    // tracks whether the children are currently visible
    const [repliesOpen, setRepliesOpen] = useState(depth < 3)

    // tracks which score blocks are currently opened by the user
    const [openScoreBlocks, setOpenScoreBlocks] = useState(Array.isArray(state.scoreBlocks)
        ? state.scoreBlocks.map(() => depth < 2)
        : []
    )
    const toggleOpen = (sbIndex: number) => setOpenScoreBlocks(open =>
        open.map((each, i) => i === sbIndex ? !each : each))
    const isEdited = () => JSON.stringify(props) !== JSON.stringify(state)

    const addScoreBlock = () => {
        setState(state => ({
            ...state,
            scoreBlocks: [
                ...state.scoreBlocks,
                {field: "", scoreNumber: NaN, explanation: ""}
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

        // TODO: need error handling for if this request fails
        deleteScore({
            variables: {
                scoreId: state.scoreBlocks[sbIndex].id
            }
        })
    }

    const editScoreBlock = (sbIndex: number, newVals: ScoreBlockType) => {
        setState(prevState => {
            const newScoreBlocks = [...prevState.scoreBlocks]
            newScoreBlocks[sbIndex] = {...newScoreBlocks[sbIndex], ...newVals}
            let state = Object.assign({}, prevState)
            state.scoreBlocks = newScoreBlocks
            return {...state}
        })
    }


    const onSave = () => {

        setState({...state, beingEdited: false})

        if (isEdited()) {
            // state.id will be NaN if it is an active reply
            if(isNotEmpty(state.text) && scoreIsIntegerBetweenOneAndTen(state.scoreBlocks)){
            if (state.activeHighlight || isNaN(state.id)) {
                if (props.killActiveSelection){
                    props.killActiveSelection()
                }
                // TODO: error handling for if this request fails
                console.log("SUBMIT STATE!", state)
                createAnnotation({
                    variables: {
                        author: user['http://www.skepsi.com/username'],
                        start: props.start || 0,
                        stop: props.stop || 0,
                        quote: "",
                        content: state.text,
                        paperId: location.pathname.replace('/', ''),
                        parentId: state.parentId ? state.parentId : undefined
                    }
                })
                    .then(response => {
                      console.log("Created annotation, moving to scores")
                        // TODO: modify the parent to know this guy is it's child (tricky error handling)
                        for (let score of state.scoreBlocks) {
                              // TODO: error handling for if this request fails
                              createScore({
                                  variables: {
                                      author: user['http://www.skepsi.com/username'],
                                      scoreNumber: score.scoreNumber,
                                      field: score.field,
                                      explanation: score.explanation,
                                      annotationId: response.data ? response.data.createAnnotation.annotation.id : undefined
                                  }
                              })
                        }
                    })
            } else {
                // TODO: error handling for if this request fails
                updateAnnotation({
                    variables: {
                        id: state.id,
                        quote: "",
                        content: state.text
                    }
                })
                    .then(() => {
                        for (let score of state.scoreBlocks) {
                          console.log("HIII", score.id, score.field, score.scoreNumber)
                            if (score.id && score.field && score.scoreNumber !== undefined) {
                                // OLD SCORE UPDATE
                                // TODO: error handling for if this request fails
                                updateScore({
                                    variables: {
                                        scoreId: score.id,
                                        explanation: score.explanation || "",
                                        field: score.field,
                                        scoreNumber: score.scoreNumber,
                                    }
                                })
                            } else {
                                // TODO: error handling for if this request fails
                                createScore({
                                    variables: {
                                        author: user['http://www.skepsi.com/username'],
                                        scoreNumber: score.scoreNumber,
                                        field: score.field,
                                        explanation: score.explanation,
                                        annotationId: state.id
                                    }
                                })
                            }
                        }
                    })
            }
            // ERROR MESSAGE HANDLING
        } else {
          if(!isNotEmpty(state.text)){
            alert('Annotations must have some text in them')
          }
          if(!scoreIsIntegerBetweenOneAndTen(state.scoreBlocks)){
            alert("Scores must be integers between 1 and 10")
          }
        }
      }
    }

    function onDelete() {
        setDeleteModalOpen(false)
        // TODO: error handling for if this request fails
        deleteAnnotation({
            variables: {
                annotationId: state.id
            }
        })
    }

    useEffect(()=>{
      console.log("STATE!", state)
    }, [state])

    useEffect(() =>{
      if(createAnnotationError || updateAnnotationError || deleteAnnotationError || createScoreError || updateScoreError || deleteScoreError){
        alert("Server down :( Apologies!")
      }
    }, [createAnnotationError, updateAnnotationError, deleteAnnotationError, createScoreError, updateScoreError, deleteScoreError, deleteModalOpen])

    // <div className={styles.header}>
    //     <div className={styles.author}>
    //         {state.author === user['http://www.skepsi.com/username'] || state.author === "???" ? "me" : state.author}
    //     </div>
    //     <div className={styles.headerSpacer}/>
    //     <div className={styles.date}>{state.date}</div>
    // </div>
    return (
        <div
            ref={props.nodeRef}
            className={styles.main}
            onClick={props.onClick}
            className={styles.annotationCard}
            style={{
                backgroundColor: depth % 2 === 1 ? "lightgrey": "white",
                borderWidth: props.active? 2 : 1,
            }}>

            <div className={styles.cardHeader}>
              <div className={styles.headerIcon}>
                <div className={styles.headerIconCircle}></div>
              </div>
              <div className={styles.headerTextWrapper}>
                <div className={styles.authorNameWrapper}>
                  <p className={styles.authorName}>{state.author === user['http://www.skepsi.com/username'] || state.author === "???" ? "me" : state.author}</p>
                </div>
                <div className={styles.createdTimeWrapper}>
                  <p className={styles.createdTime}>{state.date}</p>
                </div>
              </div>
              <div className={styles.flexComponent}></div>
              <div className={styles.headerButton}>
                <p className={styles.headerButtonText}>[+]</p>
              </div>
            </div>

            <div className={styles.cardBodyAndScores}>
            {/* BODY */}
            <div className={styles.annotationCardBody}>
              <div className={styles.scoreIndent}>
              </div>
              <div className={styles.bodyTextWrapper}>
                <p className={styles.responseText}>
                  <SometimesEditable
                      editable={state.beingEdited}
                      text={state.text}
                      callback={md => setState({...state, text: md || ""})}
                      defaultText={"...add details"}
                      editorProps={{rows: 5, cols: 20}}/>
                </p>
              </div>
            </div>

            { /* <SometimesEditable
                editable={state.beingEdited}
                callback={(s) => editScoreBlock(sbIndex, {scoreNumber: parseInt(s || "")})}
                text={sb.scoreNumber === undefined || isNaN(sb.scoreNumber) ? "?" : sb.scoreNumber.toString()}
                editorProps={{rows: 1, cols: 2}}>
            </SometimesEditable> */ }

            {/* SCORES */}
            <div className={styles.scoreBlockList}>
                {Array.isArray(state.scoreBlocks) && state.scoreBlocks.map((sb, sbIndex) => (
                    <div key={sbIndex} className={styles.scoreBlockContainerEach}>
                      <div className={styles.annotationCardScore}>
                        <div className={styles.scoreIndent}>
                          <div className={styles.scoreButtonWrapper}>
                            <div className={styles.scoreButton}>
                              {!state.beingEdited &&
                                <p className={styles.scoreButtonText}>{sb.scoreNumber}</p>
                              }
                              {/* EDITABLE */}
                              {state.beingEdited &&
                                <span className={styles.scoreNumberDropdownText}>
                                <Dropdown
                                  inline
                                  basic
                                  icon='dropdown'
                                  value={sb.scoreNumber}
                                  options={scoreNumberOptions}
                                  onChange={(e)=>
                                    editScoreBlock(sbIndex, {scoreNumber: parseInt(e.target.innerText || "")})
                                  }
                                />
                                </span>
                              }
                            </div>
                          </div>
                        </div>
                        <div className={styles.scoreMainContainer}>
                          <div className={styles.scoreLabelWrapper}>
                            {!state.beingEdited &&
                              <p className={styles.scoreLabel}><b>{titleize(sb.field)}</b></p>
                            }
                            {/* EDITABLE */}
                            {state.beingEdited &&
                            <span className={styles.dropdownWrapper}>
                              <Dropdown
                                  inline
                                  placeholder={"Please select a field"}
                                  value={titleize(sb.field)}
                                  options={fieldOptions}
                                  onChange={(e) =>
                                      // TODO: my ide seems to think innerText will sometimes not be defined here, not sure
                                      // @ts-ignore
                                      editScoreBlock(sbIndex, {field: e.target.innerText})}/>
                            </span>
                            }
                          </div>
                          <div className={styles.scoreResponse}>
                            {/* <p className={styles.responseText}>As for the experimental side, this is dubious at best. Perhapes someone can chime in with something more enlightening, but here is my verdict. As for the experimental side, this is dubious at best. Perhapes someone can chime in with something more enlightening, but here is my verdict.</p> */}
                            {/* EDITABLE */}
                            {openScoreBlocks[sbIndex] &&
                            <div className={styles.scoreBlockTextContainer}>
                                <SometimesEditable
                                    editable={state.beingEdited}
                                    text={sb.explanation || ""}
                                    callback={(md) => editScoreBlock(sbIndex, {explanation: md || ""})}
                                    defaultText={"..."}/>
                            </div>
                            }
                          </div>
                          <div>
                            {state.beingEdited &&
                                <button onClick={() => removeScoreBlock(sbIndex)}>delete</button>}
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
            </div>


            {/* NOT OPERATIONAL AT THE MOMENT, CONTROLS THE ERROR DISPLAY */}
            {Boolean(state.scoreBlocks && (state.scoreBlocks.length > 0)) &&
                (openScoreBlocks.filter(x => x).length > 0
                    ? <div className={styles.linkish}
                           onClick={() => setOpenScoreBlocks(open => open.map(() => false))}>close all</div>
                    : <div className={styles.linkish}
                           onClick={() => setOpenScoreBlocks(open => open.map(() => true))}>expand all</div>
                )
            }

            </div>

            {/*BUGGY, NEED TO FIX*/}
            {/* {errorModalOpen &&
                <Modal
                  onClose={()=>setErrorModalOpen(false)}
                  onOpen={()=>setErrorModalOpen(true)}
                  >
                <Modal.Content>Sorry, something went wrong. Please try again!</Modal.Content>
                <Modal.Actions>
                  <button onClick={()=>setErrorModalOpen(false)}></button>
                </Modal.Actions>
                </Modal>
            } */}

            {/* BUTTONS */}
            <div className={styles.buttonRow}>
                <div className={styles.buttonFlex} />
                {state.beingEdited
                    ? <>
                    <div className={styles.buttonRowWrapper}>
                        <button
                            className={styles.addScoreBlockButton}
                            onClick={isAuthenticated ? addScoreBlock : () => alert("You must sign in to add scores")}>
                            Add Score
                        </button>
                        <button
                            className={styles.saveButton}
                            onClick={isAuthenticated ? onSave : () => alert("You must sign in to save annotations")}>
                            Save
                        </button>
                        <button
                            className={styles.saveButton}
                            onClick={()=>setState({...state, beingEdited: false})}>
                            Escape
                        </button>
                      </div>
                    </>
                    : <>
                      <div>
                        {state.author === user['http://www.skepsi.com/username'] &&
                            <Button
                                icon
                                basic
                                size='mini'
                                className={styles.editButton}
                                onClick={() => {
                                    props.onChange && props.onChange()
                                    setState({...state, beingEdited: true})
                                    setOpenScoreBlocks(x => x.map(() => true))
                                }}>
                                <Icon name='edit' />
                            </Button>
                        }

                        <Button
                            icon
                            size='mini'
                            basic
                            className={styles.replyButton}
                            onClick={isAuthenticated
                                ? props.onReply
                                : () => alert('Please log in or sign up to comment')}>
                            <Icon name='reply' />
                        </Button>
                      </div>

                      {state.author === user['http://www.skepsi.com/username'] &&
                          <>
                              <Button
                                  icon
                                  basic
                                  size='mini'
                                  className={styles.editButton}
                                  onClick={() => {
                                      setDeleteModalOpen(true)
                                  }}>
                                  <Icon name='delete' />
                              </Button>

                              <Modal
                                  onClose={() => setDeleteModalOpen(false)}
                                  onOpen={() => setDeleteModalOpen(true)}
                                  open={deleteModalOpen}>
                                  <Modal.Content>Are you sure you want to delete this annotation?</Modal.Content>
                                  <Modal.Actions>
                                      <button onClick={onDelete}>Yes</button>
                                      <button onClick={() => setDeleteModalOpen(false)}>No</button>
                                  </Modal.Actions>
                              </Modal>
                          </>
                      }
                    </>
                }

                </div>

            {repliesOpen &&
                <div className={styles.childrenContainer}>
                    {Array.isArray(props.replies) &&
                        props.replies.map(each =>
                            <AnnotationCard key={each.id} {...each} _depth={depth + 1} onChange={props.onChange}/>
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
