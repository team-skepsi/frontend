import React, { useEffect } from 'react';
import { Image } from 'semantic-ui-react';
import styles from './FigureViewer.module.css'

function FigureViewer(props){

  if(props.paperMetadata){
  return(
    <div className={styles.figureWrapper}>
      {props.paperMetadata.figures.map((figure, index) =>

        <div className={styles.figureCard} key={index}>
          <div className={styles.figureImageCard}>
            <Image
              className={styles.figureImage}
              key={index}
              centered
              src={`${process.env.REACT_APP_API_AUDIENCE}media/${figure.image}`}
              alt="Image Not Found"
              />
          </div>
          <p className={styles.figureTitle}>
            <b>[{figure.figureNumber}]</b> {figure.name}
          </p>
          <p className={styles.figureCaption}>
            <em>{figure.caption}</em>
          </p>
        </div>
      )}
    </div>
  )
  }
  else{
    return(
      <div>
      </div>
    )
  }
}

export default FigureViewer
