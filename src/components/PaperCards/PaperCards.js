import React, { useEffect } from 'react';
import { Card, Loader } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'

const GET_PAPERS_BY_TOPIC = gql`
query getPapersByTopic($slug:String!){
  papersByTopic(slug:$slug){
    id
    title
    authors
    citationMLA
    topic{
      header
    }
  }
}
`

const colors = ['green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown',
'gray', 'red', 'orange', 'yellow']

function PaperCards(){
  const location = useLocation()
  const {data, error, loading} = useQuery(GET_PAPERS_BY_TOPIC, {variables:{
    slug: location.pathname.replace('/', '')
  }})

  if(loading){
    return(
      <div></div>
    )
  }

  if(data){
    return(
    <Card.Group>
      {data.papersByTopic.map((card, index) =>
        <Link to= {`/${card.id}`} key={card.id}>
        <Card key={index}
              color= {data.papersByTopic.length > colors.length ? "" : colors[index]}
              style={{margin: '15px'}}>
          <Card.Content>
            <Card.Header>
              {card.title}
            </Card.Header>
            <Card.Meta>
              {card.authors}
            </Card.Meta>
          </Card.Content>
          <Card.Content extra style={{fontSize: '10px'}}>
            {card.citationMLA}
          </Card.Content>
        </Card>
        </Link>
      )}
    </Card.Group>
    )
  }
}

export default PaperCards
