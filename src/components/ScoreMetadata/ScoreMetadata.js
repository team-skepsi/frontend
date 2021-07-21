import React, {useState, useEffect, useMemo} from 'react';
import styles from "./ScoreMetadata.module.css"
import { Card, Dropdown, Divider } from 'semantic-ui-react'
import { titleize } from '../../utility/StringManipulation.js'
import { std } from 'mathjs'
// import ReactBarChart from './ReactBarChart.tsx'
import VerticalBarChart from './VerticalBarChart.js'
import './ScoreMetadata.css'

function ScoreMetadata(props){

  const fieldSet = new Set(props.scores.map(score => score.field))
  const fieldArray = Array.from(fieldSet)
  const [chart, setChart] = useState(titleize(fieldArray[0]))
  const [xAxisData, setXAxisData] = useState()

  // CALCULATING METADATA
  let scoreArray = []
  let name = ""
  let tempArray = []

  // this is an immediately invoked function expression (IIFE)
  const calculateMetadata = (function(){
      for(let fieldName of fieldArray){
        console.log(typeof fieldName)
        name = fieldName
        let sum = 0
        let counter = 0
        for(let score of props.scores){
          if(fieldName===score.field){
            sum += score.score
            counter += 1
            tempArray.push(score.score)
        }
      }
      // add other metadata calculations to this section
      let obj = {}
      obj["field"] = titleize(name)
      obj["average"]=Number(sum/counter).toFixed(2)
      obj["standard_deviation"]=std(tempArray).toFixed(2)
      scoreArray.push(obj)
    }

    return scoreArray
  })()

  // CREATING HISTOGRAM DATA
  useEffect(()=>{
    let scoreDistribution = [0,0,0,0,0,0,0,0,0,0]
    for(let score of props.scores){
      if(titleize(score.field)===chart){
        scoreDistribution[`${score.score - 1}`] += 1
      }
    }
    setXAxisData(scoreDistribution)
  }, [chart])



  const dropdownOptions = []

    fieldArray.map(field =>
      dropdownOptions.push(
      {key: `${field}`,
       value: `${field}`,
       text: titleize(`${field}`)}
      )
    )

    useEffect(()=>{
      console.log("This is the x axis data", xAxisData)
    }, [xAxisData])


  if(xAxisData){
  return(
    <div>
      <div className={styles.barChartWrapper} style={{
        }}>
        <div className={styles.wrapperBox}>
        <div className={"dropdownWrapper"}>
          <div>
          <Dropdown
            options = {dropdownOptions}
            selection
            onChange={(data)=>setChart(data.target.innerText)}
            placeholder={chart}
            />
          </div>
          <div className={styles.horizontalFlex}/>
          <div classname={styles.metaData}>
            {calculateMetadata.map(function({field, average, standard_deviation}, index){
              if(field===chart){
                return(
                  <div>
                  <p className={styles.metadataText}><b>Mean:</b> {average}</p>
                  <p className={styles.metadataText}><b>STD:</b> {standard_deviation}</p>
                  </div>)
              }
            }
            )}
          </div>

        </div>
        <Divider />
        <VerticalBarChart
          xAxisData={xAxisData}
          />
        </div>
      </div>
      </div>
  )
}
  return(
    <div>
    </div>
  )
}

export default ScoreMetadata
