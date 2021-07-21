import React from 'react'
import Homepage from '../Homepage/Homepage.js'
import { useQuery, gql } from '@apollo/client'

const GET_ALL_TOPICS_AND_PAPERS = gql`
query AllTopicsAndPapers{
  allTopics{
    id
    header
    domain
    paperCount
    slug
  }
  allPapers{
    id
    title
    authors
    topic{
      header
      slug
    }
    annotationCount
  }
}
`

function HomepageManager(){
  const { data, error, loading } = useQuery(GET_ALL_TOPICS_AND_PAPERS)

  React.useEffect(()=>{
    console.log('paper and topics', data)
  }, [data])

  if(loading){
    return(
      <div>
      </div>
    )
  }

  if(data){
  return(
    <Homepage
      topics={data.allTopics}
      papers={data.allPapers}
      />
  )
  }
}

export default HomepageManager
