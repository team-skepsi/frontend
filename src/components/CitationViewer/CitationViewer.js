import React, {useState, useEffect} from 'react';
import { Dropdown } from 'semantic-ui-react';

const dropdownOptions = [
  {
  key: 'APA',
  value: 'APA',
  text: 'APA'
},
{
  key: 'MLA',
  value: 'MLA',
  text: 'MLA',
},
{
  key: 'Chicago',
  value: 'Chicago',
  text: 'Chicago',
},
  ]

function CitationViewer(props){
  const [activeCitation, setActiveCitation] = useState("APA")

  useEffect(()=>{
    console.log('CITATION VIEWER PROPS', props)
  }, [props])


  function handleChange(data){
    console.log('HERE!', data.target.innerText)
    setActiveCitation(data.target.innerText)
  }

  function switchCitation(parameter){
    switch(parameter){
      case 'APA':
        return props.paperMetadata ? props.paperMetadata.citationAPA : "";
      case 'MLA':
        return props.paperMetadata ? props.paperMetadata.citationMLA: "";
      case "Chicago":
        return props.paperMetadata ? props.paperMetadata.citationChicago: "";
      default:
        return "This case is not accepted";
    }

  }

  useEffect(()=>{
    console.log('ACTIVE CITATION', activeCitation)
  }, [activeCitation])

  return(
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
    <Dropdown
      options={dropdownOptions}
      selection
      defaultValue="APA"
      onChange={handleChange}
      />
    <div style={{
        height: '90%',
        width: '90%',
        margin: '20px',
        border: '2px black solid'
      }}>
      {switchCitation(activeCitation)}
    </div>
  </div>
  )
}

export default CitationViewer
