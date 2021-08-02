import React from "react"
import * as styles from "./Card.module.css"
import Noise from "./noise.png"

const Card = () => {
    return (
        <div className={styles.main}>
            <div className={styles.blend}/>
            <div className={styles.outerBox}>
                <div className={styles.innerBox}>
                    <img className={styles.noise} src={Noise} alt={"noise effect"}/>
                    <div className={styles.outerCircle}>
                        <div className={styles.innerCircle}>
                            <div className={styles.label}>
                                A
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card
