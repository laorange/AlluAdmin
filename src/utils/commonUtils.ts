export function whetherTwoArraysHaveSameElement(as: number[], bs: number[]): boolean {
    return as.filter(a => bs.indexOf(a) > -1).length > 0
}