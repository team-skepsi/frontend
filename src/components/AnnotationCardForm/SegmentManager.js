import React from 'react'

function SegmentManager(props){
  return(
    <div style={{
        width: '100%'
      }}>
      {props.segments ? props.segments.map(input=>input) : <div/>}
    </div>
  )
}

export default SegmentManager
