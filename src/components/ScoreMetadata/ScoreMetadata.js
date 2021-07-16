import React, {useState, useEffect} from 'react';

function ScoreMetadata(props){

  const fieldSet = new Set(props.scores.map(score => score.field))
  const fieldArray = Array.from(fieldSet)

  let scoreArray = []
  let name = ""
  const sumFields = (function(){
      for(let fieldName of fieldArray){
        console.log(typeof fieldName)
        name = fieldName
        let sum = 0
        for(let score of props.scores){
          if(fieldName===score.field){
            sum += score.score
        }
      }
      let obj = {}
      obj[`${name}`]=sum
      scoreArray.push(obj)
    }

    return scoreArray
  })()


  // DEBUG:
  useEffect(()=>{
    console.log(fieldArray)
    console.log('look at me', sumFields)
  }, [fieldArray, props.scores,])


  return(
    <div>
      <h1>Hi</h1>
    </div>
  )
}

export default ScoreMetadata
