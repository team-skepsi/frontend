import React, {useContext, useEffect, useState} from 'react'
import {Button, Dropdown} from 'semantic-ui-react'
import {gql, useMutation} from '@apollo/client'

import MDEditor from '../MDEditor/MDEditor.tsx'
import {AnnotationDataContext, SubmitContext} from './AnnotationCardForm.js'

import './ScoreSegment.css'

function ScoreSegment(props) {
    const CREATE_SCORE = gql`
        mutation CreateScore($annotationId:ID!, $explanation:String, $score:String!){
            createScore(annotationId:$annotationId, explanation:$explanation, score:$score){
                score{
                    id
                    score
                    explanation
                    annotation{
                        id
                    }
                }
            }
        }
    `

    const scoreOptions = [
        {
            key: 'Validity',
            text: "Validity",
            value: "Validity",
        },
        {
            key: 'Novelty',
            text: "Novelty",
            value: "Novelty",
        },
        {
            key: 'Domain Importance',
            text: "Domain Importance",
            value: "Domain Importance",
        },
    ]

    const [explanation, setExplanation] = useState("")
    const [score, setScore] = useState("")
    const annotationSubmitted = useContext(SubmitContext)
    const annotationData = useContext(AnnotationDataContext)


    const [createScore,
        {
            data: scoreData,
            error: scoreError,
            loading: scoreLoading
        }] = useMutation(CREATE_SCORE)

    useEffect(() => {
        if (annotationSubmitted && annotationData) {
            console.log("Scores also submitted")
            console.log(annotationData.createAnnotation.annotation.id)
            createScore({
                variables: {
                    annotationId: annotationData.createAnnotation.annotation.id,
                    explanation: explanation,
                    score: score
                }
            })
        }
    }, [annotationSubmitted, annotationData])

    useEffect(() => {
        console.log('HERE!', annotationData)
    }, [annotationData])


    function handleMDChange(data) {
        setExplanation(data)
    }

    function handleDropdownChange(data) {
        setScore(data.target.innerText)
    }

    return (
        <div className={"Annotation Score Segment"} style={{
            border: '2px solid rgb(129, 128, 128, 0.5)',
            padding: '10px',
            marginTop: '5px',
            contentAlign: 'center',
        }}>
            <div style={{
                display: 'flex'
            }}>
                <div style={{
                    flex: 1
                }}>
                </div>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Dropdown
                    placeholder='Select Score Category'
                    selection
                    options={scoreOptions}
                    style={{
                        width: '100%',
                        marginBottom: '5px'
                    }}
                    onChange={handleDropdownChange}
                >
                </Dropdown>
                <Button
                    id={props.id}
                    className={'delete-button'}
                    compact
                    icon='delete'
                    style={{margin: '5px'}}
                    onClick={props.handleSegmentDeleteClick}>
                </Button>
            </div>
            <div>
                <MDEditor style={{
                    resize: "none",
                    border: '2px solid rgb(129, 128, 128, 0.5)',
                    width: '100%',
                    overflow: 'auto',
                    height: '150px'
                }}
                          onMDChange={handleMDChange}
                          id={props.id}
                >
                </MDEditor>
            </div>
        </div>
    )
}

export default ScoreSegment
