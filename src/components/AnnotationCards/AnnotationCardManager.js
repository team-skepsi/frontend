import React, { useEffect, useState} from 'react';
import AnnotationCards from './AnnotationCards.js'
import { List } from "immutable"
import { Card } from 'semantic-ui-react'

function AnnotationCardManager(props){
  const [annotations, setAnnotations] = useState([])


  useEffect(() => {
  setAnnotations(List(props.annotations.sort((a,b)=>a.data.start - b.data.start)).toJS())
}, [])

useEffect(()=>{
  console.log('THESE ARE THE ANNOTATIONS', annotations)
}, [annotations])

  if(annotations.length !== 0){
  return(
    <div>
      <Card.Group>
    {annotations.data &&
    annotations.map((annotation, index)=>
      <div
        key={index}
        >
          <AnnotationCards
            key={index}
            author={annotation.data.author.username}
            content={annotation.data.content}
            scores={annotation.data.scores}
            />
      </div>
    )}
    </Card.Group>
    </div>
  )
  }

  else{
    return(<div />)
  }
}


export default AnnotationCardManager
