import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import ViewStateManager from '../ViewStateManager/ViewStateManager.js'

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
    children{
      id
    }
    scores{
      id
      score
      field
      explanation
    }
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
      createdDate
      abstract
      citationAPA
      citationMLA
      figures{
        image
        figureNumber
        name
        caption
      }
      citationChicago
      md
      topic{
        header
      }
    	references{
       id
      authors
      title
      citation
      paperOrder
      }
    }
    scoresByPaperId(paperId:$paperId){
      field
      score
    }
  }
`

function PageManager(){
  // DOCUMENT ROUTER
  const location = useLocation()
  // replace the paperId variable below with "location.pathname.replace('/','')"
  // when you want to integrate with router


  //NETWORK LOGIC
  // the network logic currently sets the paper to one for testing,
  // hook up to the document router output when integrating into the application
  const { data: paperAndAnnotationData,
          error: networkRequestError,
          loading } = useQuery(GET_PAPER_AND_ANNOTATION_DATA, {
    variables: { "paperId": location.pathname.replace('/', '')}
  })

//DEBUGGING LOGS
if(networkRequestError){
  console.log(
    `NETWORK LOGIC ERROR
    There was a network request error. To debug, make sure the backend is running, and double check the useQuery() hook, the GET_PAPER_AND_ANNOTATION_DATA constant, and the document router logic. Here's the network error: \n`
    , networkRequestError)
}

useEffect(()=>{
  console.log("NETWORK DATA [PAGE MANAGER]:", paperAndAnnotationData)
}, [paperAndAnnotationData])


  if(paperAndAnnotationData){
    return(
      <div>
      <ViewStateManager
        document = { paperAndAnnotationData.papersById }
        annotations = { paperAndAnnotationData.annotationsByPaperId }
        scores = { paperAndAnnotationData.scoresByPaperId }
        />
      </div>
    )
  }

  else{
    return(null)
  }
}

export default PageManager
