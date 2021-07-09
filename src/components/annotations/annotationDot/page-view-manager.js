import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import { Annotation } from '../../types.ts'
import AnnotationContainer from './annotation-container.js'

const GET_PAPER_AND_ANNOTATION_DATA = gql`
query GetPaperAndAnnotationData($paperId:ID!){
  annotationsByPaperId(paperId: $paperId){
    id
    content
    position
    quote
    childAnnotationCount
    start
    stop
    author{
      username
    }
    parent{
      id
    }
  }
  papersById(paperId: $paperId){
      id
      title
      authors
      citation
      topic{
        header
      }
    }
}
`

function PageViewManager(){
  const location = useLocation()
  const { data, loading, error} = useQuery(GET_PAPER_AND_ANNOTATION_DATA,
            {variables: {"paperId": 1}})

  const [annotationList, setAnnotationList] = useState([])

  useEffect(()=>{
    console.log("PAPER AND ANNOTATION DATA", data)
    if(data){
      var tempAnnotationList = []
      for(let annotation of data.annotationsByPaperId){
        tempAnnotationList.push(
          Annotation({
            start: annotation.start,
            stop: annotation.stop,
            _id: parseInt(annotation.id),
            data: {
              author: annotation.author,
              content: annotation.content,
              position: annotation.position,
              quote: annotation.quote,
              childAnnotationCount: annotation.childAnnotationCount,
              parent: annotation.parent
            }
          })
        )
      }
      console.log('TEMPORARY ANNOTATION LIST', tempAnnotationList)
      setAnnotationList(tempAnnotationList)
    }
  }, [data])

  useEffect(()=>{
    console.log('HIGHEST ANNOTATION LIST', annotationList)
  }, [annotationList])

  if(data){
    return(
      <div>
        <AnnotationContainer
          annotationList = {annotationList}
          paperInfo = { data.papersById }
          />
      </div>
      )
    }
  else{
    return(
      <div>
      </div>
    )
  }
}

export default PageViewManager
