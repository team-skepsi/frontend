import React from "react"
import PaperViewer from "./PaperViewer"
import TexProvider from "../Tex/TexProvider"

import "../../App.css"

export default {
    title: "Page/PaperViewer",
    component: PaperViewer,
}

const md = `
# Introduction

Predicate logic is a high level, human-oriented language for describing problems and problem-solving methods to computers. In this paper, we are concerned not with the use of predicate logic as a programming language in its own right, but with its use as a tool for the analysis of algorithms. Our main aim will be to study ways in which logical analysis can contribute to improving the structure and efficiency of algorithms.

The notion that computation = controlled deduction was first proposed by Pay Hayes [19] and more recently by Bibel [2] and Vaughn-Pratt [31]. A similar thesis that database systems should be regarded as consisting of a relational component, which defines the logic of the data, and a control component, which stores and retrieves it, has been successfully argued by Codd [10]. Hewitt's argument [20] for the programming language PLAN- NER, though generally regarded as an argument against logic, can also be regarded as an argument for the thesis that algorithms be regarded as consisting of both logic and control components. In this paper we shall explore some of the useful consequences of that thesis.

We represent the analysis of an algorithm $A$ into a *logic component* $L$, which defines the logic of the algorithm, and a *control component* $C$, which specifies the manner in which the definitions are used, symbolically by the equation

$$A = L + C$$

Algorithms for computing factorials are a simple example. The definition of factorial constitutes the logic component of the algorithms:

        1 is the factorial of 0;
        u is the factorial of x + 1~v is the factorial of x and u is v times x+l.

The definition can be used *bottom-up* to derive a sequence of assertions about factorial or it can be used *top-down* to reduce the problem of computing the factorial of $x + 1$ to the subproblems of computing the factorial of x and multiplying the result by $x + 1$. Different ways of using the same definition give rise to different algorithms. Bottom-up use of the definition behaves like iteration. Top-down use behaves like recursive evaluation.

The manner in which the logic component is used to solve problems constitutes the control component. As a first approximation, we restrict the control component $C$ to general-purpose problem-solving strategies which do not affect the meaning of the algorithm as it is determined by the logic component $L$. Thus different algorithms $A_1$ and $A_2$, obtained by applying different meth- ods of control Cx and C2 to the same logic definitions $L$, are equivalent in the sense that they solve the same problems with the same results. Symbolically, if $A_1 = L + C_1$ and $A_2 = L + C_2$, then $A_1$ and $A_2$ are equivalent. The relationship of equivalence between algorithms, because they have the same logic, is the basis for using logical analysis to improve the efficiency of an algorithm by retaining its logic but improving the way it is used. In particular, replacing bottom-up by top-down control often (but not always) improves efficiency, whereas re- placing top-down sequential solution of subproblems by top-down parallel solution seems never to decrease efficiency.
`

export const Example = () => (
    <TexProvider>
        <PaperViewer
            document={{
                md: md,
                title: "Algorithm = Logic + Control",
                author: "Robert Kowalski",
                date: "July 1979",
                abstract: "An algorithm can be regarded as consisting of a logic component, which specifies the knowledge to be. used in solving problems, and a control component, which determines the problem-solving strategies by means of which that knowledge is used. The logic component determines the meaning of the algorithm whereas the control component only affects its efficiency. The efficiency of an algorithm can often be improved by improving the control component without changing the logic of the algorithm. We argue that computer programs would be more often correct and more easily improved and modified if their logic and control aspects were identified and separated in the program text.",
            }}
            annotations={[
                {id: 0, start: 150, stop: 304, author: "Finn Macken", date: "today", content: "Hi guys!", children: [9, 10]},
                {id: 1, start: 580, stop: 808, author: "Finn Macken", date: "today", content: "The saladbar is great!"},
                {id: 2, start: 1190, stop: 1278, author: "Finn Macken", date: "today", content: "bruh"},
                {id: 3, start: 2348, stop: 2558, author: "Finn Macken", date: "today", content: "my favorite place to get lunch"},
                {id: 4, start: 1193, stop: 1208, author: "Finn Macken", date: "today", content: "here"},
                {id: 5, start: 1259, stop: 1276, author: "Finn Macken", date: "today", content: "another one"},
                {id: 6, start: 1108, stop: 1142, author: "Finn Macken", date: "today", content: "text"},
                {id: 7, start: 1229, stop: 1251, author: "Finn Macken", date: "today", content: "foo"},
                {id: 8, start: 1259, stop: 1339, author: "Finn Macken", date: "today", content: "stuff"},
                {id: 9, author: "Finn Macken", content: "exactly", date: "today"},
                {id: 10, author: "Finn Macken", content: "YASS!", date: "today"},
            ]}
        />
    </TexProvider>
)
