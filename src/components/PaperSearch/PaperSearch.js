import _ from 'lodash'
import faker from 'faker'
import React, { useEffect } from 'react'
import { Search, Grid, Header, Segment, Label } from 'semantic-ui-react'
import PaperSearchCards from './PaperSearchCards.js'
import styles from './PaperSearch.module.css'
import './PaperSearch.css'

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$'),
}))

const initialState = {
  loading: false,
  results: [],
  value: '',
}

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

function PaperSearch(props) {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state
  const resultRenderer = (data) => <PaperSearchCards data={data} topicArray={topicArray} />

const topicSet = new Set(props.papers ? props.papers.map(paper => paper.topic.header) : null)
  const topicArray = Array.from(topicSet)

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      function isTitleMatch(result){return(re.test(result.title))}
      function isAuthorMatch(result){return(re.test(result.authors))}
      function isTopicMatch(result){return(re.test(result.topic.header))}

      function isMatch(result){
        if(isTitleMatch(result) || isAuthorMatch(result) || isTopicMatch(result)){
          return true
        }
        else{
          return false
        }
      }

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(props.papers, isMatch),
      })
    }, 0)
  }, [])

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(()=>{
    console.log('this is the topic array:', topicArray)
  }, [topicArray])

  return (
    <div className={styles.searchWrapper}>
        <Search
          id={styles.searchBar}
          loading={loading}
          fluid
          onResultSelect={(e, data) =>
            dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
          }
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
          resultRenderer={resultRenderer}
          placeholder={"Search by title, author or topic"}
        />
      </div>
  )
}

export default PaperSearch
