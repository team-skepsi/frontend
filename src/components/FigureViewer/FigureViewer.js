import React, {useState} from 'react'
import {Card, Icon, Image, Label, Loader, Modal} from 'semantic-ui-react'
import {Img} from 'react-image'
import styles from './FigureViewer.module.css'

function FigureViewer(props) {
    const [open, setOpen] = useState(false)
    const [activeImage, setActiveImage] = useState("")

    function handleExpandClick(data) {
        setActiveImage(data.target.nextSibling.id)
        setOpen(true)

        // DEBUG:
        console.log(data.target.nextSibling.id)
    }


    if (props.paperMetadata && Array.isArray(props.paperMetadata.figures)) {
        return (
            <div className={styles.figureWrapper}>
                <Card.Group centered>
                    {props.paperMetadata.figures.map((figure, index) =>

                        <Card className={styles.figureCard} key={index}>
                            <Card.Content>
                                <div className={styles.imageWrapper}>
                                    <Label floating as="button"
                                           onClick={handleExpandClick}
                                           style={{
                                               position: 'absolute',
                                               top: '20px',
                                               left: '255px',
                                               zIndex: 10000,
                                               opacity: 0.5,
                                           }}><Icon fitted name='expand' style={{pointerEvents: 'none'}}/></Label>
                                    <Img
                                        className={styles.figureImage}
                                        id={figure.image}
                                        src={`${process.env.REACT_APP_API_AUDIENCE}media/${figure.image}`}
                                        loader={<Loader/>}
                                    />


                                </div>
                            </Card.Content>
                            <Card.Content extra>
                                <p className={styles.figureTitle}>
                                    <b>[{figure.figureNumber}]</b> {figure.name}
                                </p>
                                <p className={styles.figureCaption}>
                                    <em>{figure.caption}</em>
                                </p>
                            </Card.Content>

                        </Card>
                    )}
                </Card.Group>
                <Modal
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                >
                    <Image
                        src={`${process.env.REACT_APP_API_AUDIENCE}media/${activeImage}`}>
                    </Image>
                </Modal>
            </div>
        )
    }

    return <div>No Figures to Show</div>
}

export default FigureViewer

//src={`${process.env.REACT_APP_API_AUDIENCE}media/${figure.image}`}

// `${process.env.REACT_APP_API_AUDIENCE}media/${activeImage}`
