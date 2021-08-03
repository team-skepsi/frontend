import React, { useState, useEffect } from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import _ from 'underscore'
import styles from './FeaturedAnnotations.module.css'

const GET_ALL_ANNOTATIONS = gql`
query AllAnnotations {
  allAnnotations {
    id
    author {
      username
    }
    content
    aiData
    paper {
      id
      title
    }
  }
}
`

const GET_USER_BY_USERNAME = gql`
query GetUserByUsername($username: String!) {
  userByUsername(username: $username) {
    id
    profile {
      domains
    }
  }
}
`

function FeaturedAnnotations(){
  const [annotationTopics, setAnnotationTopics] = useState()
  const [sortedTopics, setSortedTopics] = useState()
  const [userTopicInfo, setUserTopicInfo] = useState()
  const { data, error, loading } = useQuery(GET_ALL_ANNOTATIONS)
  const [getUserByUsername,
      {data: userData,
      error: userError,
      loading: userLoading}] = useLazyQuery(GET_USER_BY_USERNAME)
  const { user, isAuthenticated } = useAuth0()

  useEffect(()=>{
    console.log("All annotations", data ? data.allAnnotations: undefined)
    console.log('Annotation Data:', data ? data.allAnnotations['2'].aiData.split(':')['2'].slice(0, -10) : "")
    if(data && data.allAnnotations){
      var annotationTopicArray = []
      for(let annotation of data.allAnnotations){
        let annotationTopics = JSON.parse(annotation.aiData.split(':')['2'].slice(0, -10).replace(/'/g, '"'));
        let annotationScores = JSON.parse(annotation.aiData.split(":")['3'].slice(0, -1))
        let annotationAIData = _.object(annotationTopics, annotationScores)
        annotationAIData['id'] = annotation.id
        annotationTopicArray.push(annotationAIData)
      }
      setAnnotationTopics(annotationTopicArray)
      console.log("ANNOTATION TOPIC OBJECT", annotationTopicArray)
      console.log("ORDERED LIST", annotationTopicArray.sort((a, b) => (a["behavioural and social sciences"] > b["behavioural and social sciences"]) ? -1 : 1))
    }
  }, [data])

  useEffect(()=>{
    console.log("Active User", user)
  }, [user])

  useEffect(()=>{
    console.log('This is the userData', userData ? userData.userByUsername.profile['0'].domains.split(',') : "")
    setUserTopicInfo(userData ? userData.userByUsername.profile['0'].domains.split(',') : "")
  }, [userData])

  useEffect(()=>{
    if(annotationTopics && userTopicInfo){
      let sortedArray = annotationTopics.sort((a, b) => (a[userTopicInfo['0']] > b[userTopicInfo['0']]) ? -1 : 1)
      setSortedTopics(sortedArray)
      console.log('SORTED TOPICS', sortedTopics, [userTopicInfo['0']])
    }
  }, [annotationTopics, userTopicInfo])


  useEffect(()=>{
    if(isAuthenticated){
      getUserByUsername({variables: {
        username: user["http://www.skepsi.com/username"]
      }})
    }
}, [isAuthenticated])

  if(loading){
    console.log("Loading or Error!", loading)
    return(
      <div>

      </div>
    )
  }

  return(
    <div>

    </div>
  )
}

export default FeaturedAnnotations
