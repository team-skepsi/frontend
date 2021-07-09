import React from "react"
import {Collection, List, RecordOf} from "immutable"
import renderer from "react-test-renderer"
import {ContentNodeType} from "./types"
import curry from "just-curry-it"

/*
Whether the list is ascending monotonically (a > b)
 */
export const isAscending = (arr: Array<number>) => arr.every(
    (x, i) => i === 0 || x > arr[i - 1]
)

export const convolve = (<ItemType, ReturnType, StateType>(fn: (item: ItemType, state: StateType) => [ReturnType, StateType], initial: StateType, items: List<ItemType>) => {
    let currentState = initial
    return items.map((item: ItemType) => {
        const [r, s] = fn(item, currentState)
        currentState = s
        return r
    })
})

export const printImmutable = (c: Collection<any, any> | RecordOf<any>, multiline?: boolean) => {
    if (multiline) {
        console.log(JSON.stringify(c.toJS(), null, 4))
    } else {
        console.log(JSON.stringify(c.toJS()))
    }
}

/*
Snapshot testing for stories files. Usage:

```
const stories = require("./FooComponent.stories");
testStories(stories);
```
 */
export const testStories = (stories: any) => {
    const sObject = Object.create(stories)
    const toTest = []

    for (let name in stories) {
        if (name !== "default"){
            toTest.push(sObject[name])
        }
    }

    test.each(toTest)(
        "render",
        c => expect(renderer.create(React.createElement(c)).toJSON()).toMatchSnapshot()
    )
}

export const nodePrettyId = (node: ContentNodeType): string => {
    return node.type + "-" + node._id
}

export const scrollToContentNode = (node: ContentNodeType) => {
    document.getElementById(nodePrettyId(node))?.scrollIntoView({behavior: "smooth", block: "center"})
}

export const spy = <T>(thing: T): T => {
    console.log(thing);
    return thing
}

export const spyWith = curry((fn: Function, thing: any) => spy(fn(thing)))
