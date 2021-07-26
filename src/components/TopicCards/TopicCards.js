import React, { useEffect } from 'react';
import { Card, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import Pluralize from 'react-pluralize'
import styles from './TopicCards.module.css'
import './TopicCards.css'

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

  useEffect(()=>{
    console.log('THESE ARE THE TOPICS:', props.topics)
  }, [props.topics])

  if(props.topics){
    return(
      <div className={styles.cardGroup}>
        {props.topics.map((card, index) =>
          <Link to={card.slug} key={card.id}>
          <div
            className={styles.card}
            style={{
              margin: '15px',
              backgroundColor: "rgba(220, 220, 220, 0.1)",
              background:`url(${process.env.REACT_APP_API_AUDIENCE}media/${card.image}) center center`,
              backgroundSize: "cover",}}
            id={styles.topicCard}>
            <div className={styles.cardHeaderWrapper} onMouseOver={console.log("Hi")}>
              <h2 className={styles.cardHeader}>{card.header}</h2>
            </div>
          </div>
          </Link>
      )}
    </div>
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

// color={props.topics.length > colors.length ? "" : colors[index]
//
// <Link to={card.slug} key={card.id}>
// <Card
//       style={{margin: '15px', backgroundColor: "rgba(220, 220, 220, 0.1)"}}
//       id={styles.topicCard}>
//   <Card.Content>
//     <Card.Header>
//       {card.header}
//     </Card.Header>
//     <Card.Meta>
//       {card.domain}
//     </Card.Meta>
//   </Card.Content>
//   <Card.Content extra>
//     <Pluralize singular={'paper'} plural={'papers'} count={card.paperCount} />
//   </Card.Content>
// </Card>
// </Link>
//
