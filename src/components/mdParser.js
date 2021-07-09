import {
    defaultRules,
    parserFor,
} from "simple-markdown"

const blockEquationRule = {
    order: 0.1,
    match: (source) => {
        return /^\$\$([\s\S]+?)\$\$(?!\$)/.exec(source)
    },
    parse: (capture, parse, state) => ({
        math: parse(capture[1], state)
    }),
}

const inlineEquationRule = {
    order: 0.2,
    match: (source) => {
        return /^\$([\s\S]+?)\$(?!\$)/.exec(source)
    },
    parse: (capture, parse, state) => ({
        math: parse(capture[1], state)
    }),
}

const rules = {
    ...defaultRules,
    inlineEquation: inlineEquationRule,
    blockEquation: blockEquationRule,
}

const parser = parserFor(rules)

const parse = (md, inline) => {
    return parser(md + "\n\n", {inline: inline})
}

export default parse
