import React, {useEffect, useState} from 'react';
import { Card, Button, Icon} from 'semantic-ui-react';
import SegmentManager from './SegmentManager.js'
import ScoreSegment from './ScoreSegment.js'
import MDEditor from '../MDEditor/MDEditor.tsx'
import { useMutation, gql } from '@apollo/client'

const CREATE_ANNOTATION = gql`
  mutation CreateAnnotation($author:String!, $content:String!){
    createAnnotation(author:$author,content:$content){
      annotation{
        id
      }
    }
  }
`

export const SubmitContext = React.createContext(false)
export const AnnotationDataContext = React.createContext(null)

function AnnotationCardForm(props){
  const [createAnnotation,
         { data: annotationData,
           error: annotationError,
           loading: annotationLoading}] = useMutation(CREATE_ANNOTATION)


  const [segments, setSegments] = useState([])
  const [segmentCounter, setSegmentCounter] = useState(0)
  const [annotationSubmitted, setAnnotationSubmitted] = useState(false)
  const [content, setContent] = useState("")

  const initialState = {
    segments: [],
    segmentCounter: 0,
    annotationSubmitted: false,
    content: ""
  }

  useEffect(() => {
    console.log('ANNOTATION STATE:', segments, segmentCounter, annotationSubmitted, content)
  }, [segments, segmentCounter, annotationSubmitted, content])


    function handleSegmentDeleteClick(event){
      for(let scoreSegments of segments){
        if(parseInt(scoreSegments.props.id) === parseInt(event.target.attributes.id.value)){
          segments.splice(segments.indexOf(scoreSegments), 1)
        }
      }
    }

    function handlePlusClick(){
      setSegments(prevSegments => [...prevSegments,
      <ScoreSegment
      id={segmentCounter}
      key={segmentCounter}
      handleSegmentDeleteClick={handleSegmentDeleteClick}
      annotationSubmitted = {annotationSubmitted}
      />])
    }

    function handleMDChange(data){
      setContent(data)
    }

    function submitAnnotationForm(){
      createAnnotation({variables: {
        author: "finn",
        content: content,
      }})
      setAnnotationSubmitted(true)
    }

  return(
    <Card style={{
        zIndex: 50,
        width: '95%',
      }}>
      <Card.Header>
        <div style={{
            display: 'flex'
          }}>
        <h3 style={{alignSelf: 'center', margin: '3px', paddingLeft: '5px'}}>Create new annotation</h3>
        <div style={{flex: 1}}></div>
          <Button
            compact
            icon='delete'
            style={{margin: '5px'}}
            onClick={()=>props.setAnnotationFormOpen(false)}>
          </Button>
        </div>
      </Card.Header>
      <Card.Content>
        <MDEditor style={{
            resize: "none",
            border: '2px solid rgb(129, 128, 128, 0.5)',
            width: '100%',
            overflow: 'auto',
            height: '150px',
          }}
          onMDChange={handleMDChange}
          >
        </MDEditor>
        <SubmitContext.Provider value={annotationSubmitted}>
          <AnnotationDataContext.Provider value={annotationData}>
            <SegmentManager
              segments = {segments}
              />
          </AnnotationDataContext.Provider>
        </SubmitContext.Provider>
      </Card.Content>

      <div style={{
          display: 'flex',
          margin: '10px',
          marginTop: '2px',
          alignItems: 'baseline',
        }}>
        <Button onClick={submitAnnotationForm}>Save Annotation</Button>
        <div className={"Add Segment Button"} style={{flex: 1}}/>
        <Icon name='plus' size='large' onClick={handlePlusClick}/>
      </div>
    </Card>
  )
}

export default AnnotationCardForm
