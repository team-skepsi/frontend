import React from "react"
import { Meta } from '@storybook/react'
import AnnotatedText from "../AnnotatedText/AnnotatedText"
import { Set } from "immutable"
import { Annotation } from "../types"

import "../../App.css"

export default {
    title: 'DocumentViewer/AnnotatedText',
    component: AnnotatedText,
} as Meta

export const Example = () => (
    <AnnotatedText
        annotations={Set([
            {start: 5, stop: 18, data: {props: {style: {fontWeight: 'bold'}}}},
            {start: 30, stop: 40},
            {start: 38, stop: 50}
        ]).map(a => Annotation(a))}>
        the first highlight asks for bold formatting, the second two overlap
    </AnnotatedText>
)
