import React from 'react'
import styles from './ScientistDomainPicker.module.css'
import { Dropdown } from 'semantic-ui-react';

function ScientistDomainPicker(){

  const options = [
    {key: "Animal Sciences", text: "Animal Sciences", value: "Animal Sciences"},
    {text: "Behavioural and Social Sciences", value: "behaviouralandsocialsciences"},
    {text: "Biochemistry", value: "biochemistry"},
    {text: "Biomedical and Health Sciences", value: "biomedicalandhealthsciences"},
    {text: "Cellular and Molecular Biology", value: "cellularandmolecularbiology"},
    {text: "Chemistry", value: "chemistry"},
    {text: "Computational Biology and Bioinformatics", value: "computationalbiologyandbioinformatics"},
    {text: "Earth and Environmental Sciences", value: "earthandenvironmentalsciences"},
    {text: "Embedded Systems", value: "embeddedsystems"},
    {text: "Energy:  Sustainable Materials and Design", value: "energy: sustainablematerialsanddesign"},
    {text: "Engineering Mechanics", value: "engineeringmechanics"},
    {text: "Environmental Engineering", value: "environmentalengineering"},
    {text: "Materials Science", value: "materialsscience"},
    {text: "Mathematics", value: "mathematics"},
    {text: "Microbiology", value: "microbiology"},
    {text: "Physics and Astronomy", value: "physicsandastronomy"},
    {text: "Plant Sciences", value: "plantsciences"},
    {text: "Robotics and Intelligent Machines", value: "roboticsandintelligentmachines"},
    {text: "Systems Software", value: "systemssoftware"},
    {text: "Translational Medical Science", value: "translationalmedicalscience"},
  ]

  return(
    <div>
      <Dropdown
        multiple
        search
        selection
        clearable
        placeholder="Select domain"
        >
        <Dropdown.Item>
          <Dropdown>
            <Dropdown.Item>
              hi
            </Dropdown.Item>
          </Dropdown>
        </Dropdown.Item>

      </Dropdown>
    </div>
  )
}

export default ScientistDomainPicker
