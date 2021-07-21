import React from 'react';
import HorizontalScroll from 'react-scroll-horizontal'
import TopicCards from '../TopicCards/TopicCards.js'
import { useQuery, gql } from '@apollo/client'
import { Card, Loader } from 'semantic-ui-react'
import { Link, } from 'react-router-dom'
import styles from './FeaturedPapers.module.css'
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


function FeaturedPapers(){
  const { data, error, loading } = useQuery(GET_ALL_PAPERS)

  if(loading){
    return(
      <div></div>
    )
  }

  if(data){
    return(
      <div className={styles.scrollComponent}>
          <div className={styles.flexWrapper}>
            {data.allPapers.map((paper, index)=>
              <Link to= {`/${paper.id}`} key={paper.id}>
              <Card key={index}
                    color= {data.allPapers.length > colors.length ? "" : colors[index]}
                    style={{margin: '15px', flex: 1}}>
                <Card.Content>
                  <Card.Header>
                    {paper.title}
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
}

export default FeaturedPapers
