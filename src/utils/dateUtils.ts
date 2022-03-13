import dayjs from "dayjs";

export function formatDate(date: dayjs.Dayjs): string {
    return date.format("YYYY-MM-DD")
}

export function formatTime(time: dayjs.Dayjs): string {
    return time.format("HH:mm:ss");
}

export function formatDatetime(datetime: dayjs.Dayjs): string {
    return datetime.format("YYYY-MM-DD HH:mm:ss");
}

export function getIsoWeekDay(date: dayjs.Dayjs): number {
    let day = date.day();
    return day === 0 ? 7 : day;
}

export function getWeeksBetweenTwoDayFrom0(a: dayjs.Dayjs, b: dayjs.Dayjs) {
    return Math.floor(a.diff(b) / 604800000);
}