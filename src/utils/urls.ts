let SAME_SITE_AS_DJANGO = false;

function getUrlCommon(relativeUrl: string): string {
    if (SAME_SITE_AS_DJANGO) {
        return relativeUrl
    } else {
        return "https://siae.top" + relativeUrl
    }
}

const urls = {
    api: {
        classroom: getUrlCommon("/course/api/Classroom/"),
        course: getUrlCommon("/course/api/Course/"),
        courseChangeLog: getUrlCommon("/course/api/CourseChangeLog/"),
        courseInfo: getUrlCommon("/course/api/CourseInfo/"),
        coursePlan: getUrlCommon("/course/api/CoursePlan/"),
        courseType: getUrlCommon("/course/api/CourseType/"),
        group: getUrlCommon("/course/api/Group/"),
        notice: getUrlCommon("/course/api/Notice/"),
        semesterConfig: getUrlCommon("/course/api/SemesterConfig/"),
        teacher: getUrlCommon("/course/api/Teacher/"),
    },
    docs: "https://laorange.gitee.io/alludocs/",
}

export default urls