import React, { useEffect } from 'react';
import { Card, Loader, Divider } from 'semantic-ui-react'
import { Link, useLocation } from 'react-router-dom'
import { useQuery, gql, Reveal } from '@apollo/client'
import styles from './PaperCards.module.css'
import Navbar from '../Navbar/Navbar.js'
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
      <React.Fragment>
        <div className={styles.navbarWrapper}>
          <Navbar usesPageWrapper={true} />
        </div>
        <div className={styles.topicHeaderWrapper}>
          <div className={styles.topicHeader}>
            <h1 className={styles.topicHeaderText}>Poverty</h1>
          </div>
        </div>
        <div className={styles.paperCardsWrapper}>
          <div className={styles.descriptionBox}>
            <p className={styles.topicDescription}>
              Poverty entails more than the lack of income and productive resources to ensure sustainable livelihoods. Its manifestations include hunger and malnutrition, limited access to education and other basic services, social discrimination and exclusion, as well as the lack of participation in decision-making. In 2015, more than 736 million people lived below the international poverty line. Around 10 per cent of the world population (pre-pandemic) was living in extreme poverty and struggling to fulfil the most basic needs like health, education, and access to water and sanitation, to name a few. There were 122 women aged 25 to 34 living in poverty for every 100 men of the same age group, and more than 160 million children were at risk of continuing to live in extreme poverty by 2030.
            </p>
          </div>
          <div className={styles.toolBar}>
            <div className={styles.toolBarFlexFill} />
            <div className={styles.toolbarIconsWrapper}>
            </div>
          </div>
          <div>
            <div className={styles.cardGroupWrapper}>
              <div className={styles.cardGroup}>
                {data.papersByTopic.map((card, index) =>
                  <Link to= {`/${card.id}`} key={card.id}>
                  <Card key={index}
                        color= {data.papersByTopic.length > colors.length ? "" : colors[index]}
                        style={{margin: '15px'}}
                        style={{margin: '15px', padding: "7px", flex: 1, height: '200px', width: "250px"}}
                        >
                    <Card.Content>
                      <Card.Header>
                        {card.title}
                      </Card.Header>
                      <Card.Meta>
                        {card.authors}
                      </Card.Meta>
                    </Card.Content>
                    <Card.Content extra style={{fontSize: '10px'}}>
                    </Card.Content>
                  </Card>
                  </Link>
                )}
              </div>
            </div>
          </div>
      </div>
    </React.Fragment>
    )
  }
}

export default PaperCards

//
// <div className={styles.underlineWrapper}>
//   <div className={styles.descriptionBoxUnderline}/>
// </div>
