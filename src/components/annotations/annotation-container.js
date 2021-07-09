import React, { useEffect } from 'react';
import TopLevelAnnotations from './top-level-annotations.js'
import { useQuery, gql } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import { Message, Divider, Label} from 'semantic-ui-react'

const GET_PAPERS_BY_ID = gql`
  query GetPaperById($paperId:ID!){
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

function AnnotationContainer(){
  const location=useLocation()
  const { data, error, loading } = useQuery(GET_PAPERS_BY_ID, {
    variables: { "paperId": location.pathname.replace('/','')}
  })

  useEffect(() => {
    console.log('PAPER DATA', data)
  }, [data])

  if(loading){
    return(
    <div>
      <TopLevelAnnotations />
    </div>
    )
  }

  if(data){
  return(
    <div>
      <div>
        <Message color='grey' size='large'>
          <Message.Content>
            <Message.Header>
              {data.papersById.title} [ID: {data.papersById.id}]
            </Message.Header>
            <p>
              {data.papersById.authors}
            </p>
            <Divider />
            <Message.Content>
              <em>
                {data.papersById.citation}
              </em>
            </Message.Content>
          </Message.Content>
        </Message>

      </div>
      <TopLevelAnnotations />
    </div>
    )
  }
}

export default AnnotationContainer
