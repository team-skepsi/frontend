import React, { useEffect } from 'react';
import { Card, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import Pluralize from 'react-pluralize'
import styles from './TopicCards.module.css'

var slugify = require('slugify')

const colors = ['green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown',
'gray', 'red', 'orange', 'yellow']


  const topicCards = [
    {
      header: "Quantum Computing",
      domain: "Quantum Information Technology",
      index: 1,
      paperCount: "15 papers",
      color: 'green',
      link: '/quantum-computing',
    },
    {
      header: "Covid-19",
      domain: "Biomedical Science",
      index: 2,
      paperCount: "30 papers",
      color: 'teal',
      link: '/covid-19',
    },
    {
      header: "Biomimicry",
      domain: "Life Sciences",
      index: 3,
      paperCount: "4 papers",
      color: 'blue',
      link: '/biomimicry',
    }
  ]

function TopicCards(props){

  if(props.topics){
    return(
      <Card.Group>
        {props.topics.map((card, index) =>
          <Link to={card.slug} key={card.id}>
          <Card color= {props.topics.length > colors.length ? "" : colors[index]}
                style={{margin: '15px', backgroundColor: "rgba(220, 220, 220, 0.1)"}}>
            <Card.Content>
              <Card.Header>
                {card.header}
              </Card.Header>
              <Card.Meta>
                {card.domain}
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Pluralize singular={'paper'} plural={'papers'} count={card.paperCount} />
            </Card.Content>
          </Card>
          </Link>
      )}
      </Card.Group>
    )
  }

  else{
  return(
    <Card.Group>
      {topicCards.map((card) =>
        <Link to={card.link} key={card.index}>
        <Card color= {card.color} style={{margin: '15px'}}>
          <Card.Content>
            <Card.Header>
              {card.header}
            </Card.Header>
            <Card.Meta>
              {card.domain}
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            />
          </Card.Content>
        </Card>
        </Link>
    )}
    </Card.Group>
  )
}
}

export default TopicCards
