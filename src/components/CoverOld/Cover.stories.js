import React from "react"
import Cover from "./Cover"
import "../../App.css"

export default {
    title: "Page/Cover",
    component: Cover,
}

export const Example = () => (
    <Cover
        paperMetadata={{
            topic: "Computer Science",
            title: "Algorithm = Logic + Control",
            author: "Robert Kowalski",
            date: "1979",
            header: "foo",
            abstract: "An algorithm can be regarded as consisting of a logic component, which specifies the knowledge to be. used in solving problems, and a control component, which determines the problem-solving strategies by means of which that knowledge is used. The logic component determines the meaning of the algorithm whereas the control component only affects its effciency. The effkiency of an algorithm can often be improved by improving the control component without changing the logic of the algorithm. We argue that computer programs would be more often correct and more easily improved and modified if their logic and control aspects.",
        }}/>
)
