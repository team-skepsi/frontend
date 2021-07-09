import React from 'react'
import {Card} from 'semantic-ui-react'

function ReferenceViewer(props) {

    if (!props.paperMetadata){
      return <div/>
    }

    return (
        <Card.Group centered>
            {Array.isArray(props.paperMetadata.references) && props.paperMetadata.references.map((reference, index) =>
                <Card key={index}>
                    <Card.Header style={{padding: '5px'}}>
                        [{reference.paperOrder}] {reference.title}
                    </Card.Header>
                    <Card.Meta>
                        {reference.authors}
                    </Card.Meta>
                    <Card.Content>
                        {reference.citation}
                    </Card.Content>
                </Card>
            )}
        </Card.Group>
    )
}

export default ReferenceViewer
