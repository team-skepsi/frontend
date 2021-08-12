import {defaultRules, parserFor, SingleASTNode} from "simple-markdown"
import ContentNode, {ContentNodeType} from "./contentNode"
import {List} from "immutable"

export const isAst = (thing: any): thing is SingleASTNode => thing && typeof thing.type === "string"

const blockEquationRule = {
    order: 0.1,
    match: (source: string) => {
        return /^\$\$([\s\S]+?)\$\$(?!\$)/.exec(source)
    },
    parse: (capture: any, parse: any, state: any) => ({
        math: parse(capture[1], state)
    }),
}

const inlineEquationRule = {
    order: 0.2,
    match: (source: string) => {
        return /^\$([\s\S]+?)\$(?!\$)/.exec(source)
    },
    parse: (capture: any, parse: any, state: any) => ({
        math: parse(capture[1], state)
    }),
}

const rules = {
    ...defaultRules,
    inlineEquation: inlineEquationRule,
    blockEquation: blockEquationRule,
}

const parser = parserFor(rules)

/*
parses a markdown string, returning an array of AST trees
 */
export const parseToAst = (md: string, inline?: boolean) => {
    return parser(md + "\n\n", {inline: inline || false})
}

/*
Recursive type coercion of an ast tree
 */
export const astToNode = (astNode: SingleASTNode): ContentNodeType => {
    let {type, content, ...rest} = astNode

    // simple-markdown sometimes loads the nodes down with crap we don't want
    const props: {[key: string]: any} = {}
    for (const key in rest){
        if (rest.hasOwnProperty(key) && key[0] !== "_"){
            props[key] = rest[key]
        }
    }

    // recursive calls
    if (Array.isArray(content)) {
        content = List(content.map((c) => {
            if (isAst(c)){
                return astToNode(c)
            } else {
                throw Error("content array can only contain ast")
            }
        }))
    } else if (isAst(content)) {
        content = astToNode(content)
    }

    return ContentNode({
        type: type,
        content: content,
        props: props
    })
}

export const parseToNode = (md: string, inline?: boolean) => (
    astToNode({type: "div", content: parseToAst(md, inline)})
)
