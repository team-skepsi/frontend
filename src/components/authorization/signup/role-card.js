import React from 'react';
import { Reveal, Card, Icon } from 'semantic-ui-react'

function RoleCard(){
  return(
    <Reveal animated='fade'>
      <Reveal.Content visible>
        <Card style={{height:'100px', width:'300px', display: 'flex', justifyContent:'center'}}>
          <Card.Header style={{textAlign: 'center', fontSize:'20px', fontWeight:'bold'}}>
            <Icon name='flask'>
            </Icon>
            Scientist
          </Card.Header>
        </Card>
      </Reveal.Content>
      <Reveal.Content hidden>
        <Card color='green' style={{height:'100px', width:'300px', display: 'flex', justifyContent: 'center'}}>
            <Card.Content style={{textAlign: 'center', fontSize:'16px', fontWeight:'bold'}}>
              A scientist, academic or graduate student. Uses ORCID for identification.
          </Card.Content>
        </Card>
      </Reveal.Content>
    </Reveal>
  )
}
