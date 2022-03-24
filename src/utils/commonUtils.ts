export function whetherTwoArraysHaveSameElement(as: number[], bs: number[]): boolean {
    return as.filter(a => bs.indexOf(a) > -1).length > 0
}

export function getFormalWhichLessonString(whatLesson: number) {
    return `第${whatLesson * 2 - 1}、${whatLesson * 2}节课`
}

const whatDayList = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]

export function getFormalWhatDayString(whatDay: number) {
    return whatDayList[whatDay - 1]
}