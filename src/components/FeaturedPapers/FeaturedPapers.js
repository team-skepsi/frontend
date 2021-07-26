import React from 'react';
import HorizontalScroll from 'react-scroll-horizontal'
import TopicCards from '../TopicCards/TopicCards.js'
import { useQuery, gql } from '@apollo/client'
import { Card, Loader } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import styles from './FeaturedPapers.module.css'
import './FeaturedPapers.css'
import Pluralize from 'react-pluralize'

const GET_ALL_PAPERS = gql`
query GetAllPapers{
  allPapers{
    id
    title
    authors
    topic{
      header
    }
    annotationCount
  }
}
`

const colors = ['green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown',
'gray', 'red', 'orange', 'yellow']


function FeaturedPapers(props){


  if(props.papers){
    return(
      <div className={styles.scrollComponent}>
          <div className={styles.flexWrapper}>
            {props.papers.map((paper, index)=>
              <Link to= {`/${paper.id}`} key={paper.id}>
              <Card key={index}
                    color= {props.papers.length > colors.length ? "" : colors[index]}
                    style={{margin: '15px', padding: "5px", flex: 1, height: '200px', width: "250px"}}>
                <Card.Content >
                  <Card.Header>
                    <div className={styles.titleWrapper}>
                    <h3>{paper.title}</h3>
                    </div>
                  </Card.Header>
                  <Card.Meta>
                    {paper.authors}
                  </Card.Meta>
                  </Card.Content>

                <Card.Content extra>
                  <Pluralize singular={'annotation'} plural={'annotations'} count={paper.annotationCount} />
                </Card.Content>
              </Card>
              </Link>
            )}
          </div>
      </div>
    )
  }

  return(
    <div></div>
  )
}

export default FeaturedPapers
