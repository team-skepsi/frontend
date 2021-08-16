import React from 'react';
import styles from './SearchPage.module.css'
import PaperSearch from '../PaperSearch/PaperSearch.js'
import NavbarHomepage from '../NavbarHomepage/NavbarHomepage.js'
import { gql, useQuery } from '@apollo/client'

const ALL_PAPERS = gql`
query AllPapers{
  allPapers{
    id
    title
    authors
    citationMLA
    abstract
    annotationCount
    createdDate
    topic{
      header
      description
      image
    }
  }
}
`
function SearchPage(){
  const {data, error, loading} = useQuery(ALL_PAPERS)

  if(data){
    return(
      <div>
        <NavbarHomepage />
        <div className={styles.searchWrapper}>
        <PaperSearch
          papers={data.allPapers}
          />
        </div>
      </div>
    )
  }

  return(
    <div>
    </div>
  )
}

export default SearchPage
