import { isAscending, convolve, range } from "./functions"
import {List} from "immutable"

it("can tell if an array isAscending", () => {
    expect(isAscending([1, 2, 3])).toEqual(true)
    expect(isAscending([2, 1, 3])).toEqual(false)
    expect(isAscending([])).toEqual(true)
    expect(isAscending([1])).toEqual(true)
})

it("convolves", () => {
    expect(convolve(
        (x, s) => [x + s, s + 1],
        0,
        List(Array(5).fill(0))
    )).toEqual(List([0, 1, 2, 3, 4]))
})

it("can make ranges", () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4])
    expect(range(2, 5)).toEqual([2, 3, 4])
    expect(() => range(0, 5, -1)).toThrow()
    expect(range(4, 0, -2)).toEqual([4, 2])
})
