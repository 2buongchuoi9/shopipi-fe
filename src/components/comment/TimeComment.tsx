import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { useEffect, useState } from 'react'
// import duration from "dayjs/plugin/duration"
// import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
// dayjs.extend(duration)
// dayjs.extend(relativeTime)

dayjs.locale('vi')
dayjs.extend(utc)
dayjs.extend(timezone)

function timeAgo(time: string) {
    // console.log('time', time)
    const now = dayjs()
    const then = dayjs(time, 'DD-MM-YYYY HH:mm:ss')

    const seconds = now.diff(then, 'second')
    const minutes = now.diff(then, 'minute')
    const hours = now.diff(then, 'hour')
    const days = now.diff(then, 'day')

    if (seconds < 60) {
        return `${seconds} giây trước`
    } else if (minutes < 60) {
        return `${minutes} phút trước`
    } else if (hours < 24) {
        return `${hours} giờ trước`
    } else if (days < 2) {
        return `hôm qua ${hours % 24} giờ`
    } else {
        return dayjs(time, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY HH:mm')
    }
}

const TimeComment = ({ createdAt }: { createdAt: string }) => {
    // const a = dayjs(createdAt, 'DD-MM-YYYY HH:mm:ss')
    const [time, setTime] = useState(() => timeAgo(createdAt))

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(timeAgo(createdAt))
        }, 15000) // cập nhật thời gian sau mỗi 60 giây

        return () => {
            clearInterval(timer) // dọn dẹp khi component unmount
        }
    }, [createdAt])

    return (
        <>
            {/* các thông tin khác của comment */}
            <span>{time === 'Invalid Date' ? createdAt : time}</span>
        </>
    )
}
export default TimeComment
