import React, {useReducer} from 'react'
import {Accordion, Card} from 'semantic-ui-react'

function AnnotationCards(props){
    const accordionData = [
        {
            header: 'Header One',
            content: "Content One",
        },
        {
            header: 'Header Two',
            content: "Content Two",
        },
        {
            header: 'Header Three',
            content: "Content Three",
        },
        {
            header: 'Header Four',
            content: "Content Four",
        },
        {
            header: 'Header Five',
            content: "Content Five",
        }
    ]

    const initialState = {
        activeScores: [false, false, false, false, false],
        activeCard: true
    }

    function reducer(state, action) {
        switch (action.type) {
            case 'toggleScore':
                let activeScores = [...state.activeScores]
                activeScores[action.payload] = !state.activeScores[action.payload]
                return {...state, activeScores: activeScores}
            case 'toggleCard':
                return {...state, activeCard: !state.activeCard}
            default:
                console.log("Wrong reducer input")
        }

    }

    const [state, dispatch] = useReducer(reducer, initialState)

    const handleClick = value => () => {
        dispatch({type: 'toggleScore', payload: value})
    }

    function handleHeaderClick() {
        dispatch({type: 'toggleCard'})
    }

    return (
        <Card style={{
            zIndex: 0,
            width: '95%',
            overflowWrap: 'break-word'

        }}>
            <Accordion
                styled
                exclusive={false}
                fluid
            >
                <Accordion.Title
                    onClick={handleHeaderClick}
                    active={state.activeCard}>
                    <Card.Header>
                        <div style={{
                            display: 'flex',
                            borderBottom: 'rgb(129, 128, 128, 0.5) 1px solid'
                        }}>
                            <div>
                                <p style={{
                                    fontSize: '20px',
                                    padding: '3px'
                                }}>{props.author ? props.author: '[Null]'}</p>
                            </div>
                            <div style={{
                                flex: 1
                            }}>
                            </div>
                            <div style={{
                                padding: '3px'
                            }}>
                                <p>Today</p>
                            </div>
                        </div>

                    </Card.Header>
                </Accordion.Title>

                <Accordion.Content
                    active={state.activeCard}>
                    <Card.Content>
                        <p style={{fontSize: '14px'}}>{props.content ? props.content : "[No content]"}</p>
                    </Card.Content>


                    {props.scores.map((score, index) =>
                        <div>
                            <Accordion.Title
                                index={index}
                                onClick={handleClick(index)}
                                active={state.activeScores[index]}
                            >
                                <p style={{fontSize: '14px'}}>{score.score ? score.score : "[No score provided]"}</p>
                            </Accordion.Title>
                            <Accordion.Content
                                active={state.activeScores[index]}
                            >
                                <p style={{fontSize: '14px'}}>{score.explanation ? score.explanation : "[No explanation]"}</p>
                            </Accordion.Content>
                        </div>
                    )}
                </Accordion.Content>

            </Accordion>
        </Card>
    )

}

export default AnnotationCards
