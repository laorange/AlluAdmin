import * as dayjs from 'dayjs'

//region Defined Types
export type WhatDay = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type WhichLesson = 1 | 2 | 3 | 4 | 5

export type methodChoice = "Course" | "TD" | "TP" | "Exam"

export type Classroom = {
    "room_id": number,
    "name": string,
    "is_common": boolean
}

export type Course = {
    "course_id": number,
    "plan": number,
    "room": number,
    "date": string | dayjs.Dayjs,
    "which_lesson": number,
    "note": string | null,
    "update_time": string | dayjs.Dayjs,
    "color": string,
    "period": number,
    "semester": number,
    "code": string | null,
    "ch_name": string | null,
    "en_name": string | null,
    "fr_name": string | null,
    "method": methodChoice,
    "group_ids": string,
    "teacher_name": string | null,
    "room_name": string | null
}

export type CourseChangeLog = {
    "log_id": number,
    "plan": number,
    "action": "Create" | "Method" | "Update",
    "description": string | null,
    "update_time": string | dayjs.Dayjs,
    "color": string,
    "period": number,
    "semester": number,
    "code": string | null,
    "ch_name": string | null,
    "en_name": string | null,
    "fr_name": string | null,
    "method": methodChoice,
    "group_ids": string | null,
    "teacher_name": string | null
}

export type CourseInfo = {
    "info_id": number,
    "type": number,
    "period": number,
    "semester": number,
    "code": string | null,
    "ch_name": string,
    "en_name": string | null,
    "fr_name": string | null,
    "color": string
}

export type CoursePlan = {
    "plan_id": number,
    "teacher": number,
    "info": number,
    "groups": number[],
    "method": methodChoice,
    "color": string,
    "teacher_name": string
}

export type CourseType = {
    "type_id": number,
    "name": string,
    "color": string
}

export type Group = {
    "group_id": number,
    "period": number,
    "semester": number,
    "name": string
}

export type Notice = {
    "notice_id": number,
    "content": string,
    "link": string | null,
    "priority": number,
    "validity": boolean,
    "update_time": string | dayjs.Dayjs
}

export type SemesterConfig = {
    "current_period": number,
    "current_period_display": string,
    "week1_monday_date": string | dayjs.Dayjs,
    "max_week": number
}

export type Teacher = {
    "teacher_id": number,
    "name": string | null,
    "validity": boolean
}

//endregion
