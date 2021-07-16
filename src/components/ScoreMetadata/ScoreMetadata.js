import React, {useState, useEffect} from 'react';
import styles from "./ScoreMetadata.module.css"
import { Card } from 'semantic-ui-react'

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
        let counter = 0
        for(let score of props.scores){
          if(fieldName===score.field){
            sum += score.score
            counter += 1
        }
      }
      let obj = {}
      obj["field"] = name
      obj["metadata"]=Number(sum/counter).toFixed(2)
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
      <div className={styles.metadataWrapper}>
        {sumFields.map(({field, metadata}, index)=>
          <div key={index}>
            <Card>
                <p className={styles.metadataText}>{field}: {metadata}</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScoreMetadata
